import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleDestroy,
  OnModuleInit
} from '@nestjs/common';
import { Response } from 'express';
import { DatabaseService } from 'src/database/database.service';
import { mailQueries } from './mail.queries';
import { successhandler, successMessage } from 'src/global/successhandler';
import { map, BehaviorSubject } from 'rxjs';
import { createClient, RedisClientType } from 'redis';
import { ConfigService } from '@nestjs/config';
import * as os from 'os';
import { MailCreateUtil } from './util/mailCreateUtil';
import { Nullable } from 'src/global/utils/dataCustomType';

@Injectable()
export class MailService implements OnModuleInit, OnModuleDestroy {
  private subscriber: RedisClientType;
  private publisher: RedisClientType;
  private sseSubjects: Map<number, BehaviorSubject<string>> = new Map();
  private myIp: string;
  private intervalConnect: NodeJS.Timeout;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
    private readonly mailCreateUtil: MailCreateUtil
  ) {}

  onModuleDestroy() {
    const keys = this.sseSubjects.keys();
    for (const key in keys) {
      this.publisher.del(key);
    }

    if (this.intervalConnect) {
      clearInterval(this.intervalConnect);
    }
  }

  async onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    this.subscriber = createClient({ url: redisUrl });
    this.publisher = createClient({ url: redisUrl });

    await this.subscriber.connect();
    await this.publisher.connect();

    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
      const networkInfo = networkInterfaces[interfaceName];
      if (networkInfo) {
        const ipv4 = networkInfo.find(info => info.family === 'IPv4' && !info.internal);
        if (ipv4) {
          this.myIp = String(ipv4.address);
          break;
        }
      }
    }

    this.subscriber.subscribe('notifications', message => {
      const parsedMessage = JSON.parse(message);
      const memberId = parsedMessage.memberId;
      if (this.sseSubjects.has(memberId)) {
        const data = {
          check: true,
          time: new Date()
        };
        const body = successhandler(successMessage.GET_MAIL_ALARM_SUCCESS, data);
        this.sseSubjects.get(memberId)?.next(JSON.stringify(body));
      }
    });

    this.intervalConnect = setInterval(() => {
      this.sseSubjects.forEach(subject => subject.next('false'));
    }, 90 * 1000);
  }

  async connectSse(memberId: number, res: Response) {
    const checkUnread = await this.databaseService.query(mailQueries.checkUnreadQuery, [memberId]);
    const data = {
      check: checkUnread.rows[0].result,
      time: new Date()
    };
    const body = successhandler(successMessage.GET_MAIL_ALARM_SUCCESS, data);

    if (!this.sseSubjects.has(memberId)) {
      const newSubject = new BehaviorSubject<string>(JSON.stringify(body));
      this.sseSubjects.set(memberId, newSubject);
    }

    const userSubject = this.sseSubjects.get(memberId);
    if (!userSubject) {
      throw new HttpException(
        '유저 서브젝트가 제대로 생성되지 않았습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    await this.publisher.set(`sseRedisMember:${memberId}`, this.myIp);
    const testCall = await this.publisher.get(`sseRedisMember:${memberId}`);
    console.log(testCall);

    res.on('close', () => {
      this.sseSubjects.delete(memberId);
      this.publisher.del(`sseRedisMember:${memberId}`);
      res.end();
    });

    return userSubject.asObservable().pipe(map(message => ({ data: message })));
  }

  async sendMessage(memberId: number) {
    const serverInfo = await this.publisher.get(`sseRedisMember:${memberId}`);
    if (!serverInfo) {
      console.log(`${memberId}번 유저에 대해서 알림을 보낼 수 없어요. 연결이 안됐거등요.`);
      return;
    }

    if (serverInfo === this.myIp) {
      const subject = this.sseSubjects.get(memberId);
      if (subject) {
        const data = {
          check: true,
          time: new Date()
        };
        const body = successhandler(successMessage.GET_MAIL_ALARM_SUCCESS, data);
        subject.next(JSON.stringify(body));
      }
    } else {
      await this.publisher.publish('notifications', JSON.stringify({ memberId }));
    }
  }

  async getMailsByMemberId(memberId: number) {
    try {
      const response = await this.databaseService.query(mailQueries.getAllMailQuery, [memberId]);
      const processedMails = await Promise.all(
        response.rows.map(async mail => {
          const {
            mail_id: mailId,
            action,
            content,
            param2,
            param3,
            created_at: createdAt,
            read_status: readStatus
          } = mail;
          let { param1 } = mail;

          if (action === 1 || action === 2) {
            param1 = (await this.databaseService.query(mailQueries.getCropName, [param1])).rows[0]
              .crop_name;
          } else if (action === 4 || action === 5 || action || 7) {
            param1 = (
              await this.databaseService.query(mailQueries.getMemberNickNameByMemberID, [param1])
            ).rows[0];
          }

          const formattedContent = await this.mailCreateUtil.createMailString(
            action,
            param1?.toString() || '',
            param2?.toString() || '',
            param3?.toString() || '',
            content || ''
          );

          return {
            mailId,
            content: formattedContent,
            createdAt,
            readStatus
          };
        })
      );

      await this.databaseService.query(mailQueries.makeReadedQuery, [memberId]);
      return processedMails;
    } catch (error) {
      throw new HttpException('메일 기록을 가져오는 도중에 에러 발생 : ', error);
    }
  }

  async deleteAllMailByMemberId(memberId: number) {
    try {
      await this.databaseService.query(mailQueries.deleteMailQuery, [memberId]);
    } catch (error) {
      throw new HttpException('메일 기록을 삭제하는 도중에 에러 발생 : ', error);
    }
  }

  async createMailByOtherService(
    member_id: number,
    action: number,
    param1: Nullable<number>,
    param2: Nullable<number>,
    param3: Nullable<number>,
    content: Nullable<string>
  ) {
    await this.databaseService.query(mailQueries.InsertMailQuery, [
      member_id,
      action,
      param1,
      param2,
      param3,
      content
    ]);

    this.sendMessage(member_id);
  }
}
