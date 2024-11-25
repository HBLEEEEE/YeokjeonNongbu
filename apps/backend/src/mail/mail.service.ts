import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleDestroy,
  OnModuleInit
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Response } from 'express';
import { DatabaseService } from 'src/database/database.service';
import { mailQueries } from './mail.queries';
import { successhandler, successMessage } from 'src/global/successhandler';
import { map, BehaviorSubject } from 'rxjs';
import { MailRedisUtil } from './util/mailRedisUtil';
import { createClient, RedisClientType } from 'redis';
import { ConfigService } from '@nestjs/config';
import * as os from 'os';

@Injectable()
export class MailService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailRedisUtil: MailRedisUtil
  ) {}
  private subscriber: RedisClientType;
  private publisher: RedisClientType;
  private sseSubjects: Map<number, BehaviorSubject<string>> = new Map();
  private configService: ConfigService;
  private myIp: string;

  async onModuleInit() {
    this.subscriber = createClient({ url: this.configService.get<string>('REDIS_URL') });
    this.publisher = createClient({ url: this.configService.get<string>('REDIS_URL') });

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
      const clientId = parsedMessage.clientId;
      const data = parsedMessage.data;

      if (this.sseSubjects.has(clientId)) {
        this.sseSubjects.get(clientId)?.next(data);
      }
    });
  }

  async onModuleDestroy() {
    await this.subscriber.quit();
    await this.publisher.quit();
  }

  async addClient(memberId: number, res: Response) {
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

    await this.publisher.set(`member:${memberId}`, this.myIp);

    res.on('close', () => {
      this.sseSubjects.delete(memberId);
      this.mailRedisUtil.deleteSseRedis(String(memberId));
      res.end();
    });

    return userSubject.asObservable().pipe(map(message => ({ data: message })));
  }

  async sendMessage(memberId: number, msg: string) {
    const serverInfo = await this.publisher.get(`member:${memberId}`);
    if (!serverInfo) {
      console.log(`${memberId}번 유저에 대해서 알림을 보낼 수 없어요. 연결이 안됐거등요.`);
      return;
    }

    if (serverInfo === this.myIp) {
      const subject = this.sseSubjects.get(memberId);
      if (subject) {
        subject.next(msg);
      }
    } else {
      await this.publisher.publich('server-events', JSON.stringify({ memberId, msg }));
    }
  }

  async connectSseAndInitiate(memberId: number, res: Response) {
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

    this.mailRedisUtil.registerSseRedis(String(memberId));

    res.on('close', () => {
      this.sseSubjects.delete(memberId);
      this.mailRedisUtil.deleteSseRedis(String(memberId));
      res.end();
    });

    return userSubject.asObservable().pipe(map(message => ({ data: message })));
  }

  async startAlarm(memberId: number) {
    const ip = await this.mailRedisUtil.getSseRedis(String(memberId));
    if (ip === null) {
      throw new HttpException('레디스에 정보 없음.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const url = `${ip}:8080/api/mail/call/${memberId}`;
    try {
      await fetch(url);
    } catch (error) {
      throw new Error(`API 호출 실패: ${error.message}`);
    }
  }

  @OnEvent('sendAlarm')
  async handleAlarmEventObs(memberId: number) {
    const userSubject = this.sseSubjects.get(memberId);

    if (userSubject) {
      const data = {
        check: true,
        time: new Date()
      };
      const body = successhandler(successMessage.GET_MAIL_ALARM_SUCCESS, data);
      userSubject.next(JSON.stringify(body));
    } else {
      throw new Error(`잘못된 알람 생성 요청입니다.`);
    }
  }

  async getMailsByMemberId(memberId: number) {
    try {
      const response = await this.databaseService.query(mailQueries.getAllMailQuery, [memberId]);
      await this.databaseService.query(mailQueries.makeReadedQuery, [memberId]);
      return response.rows;
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
}
