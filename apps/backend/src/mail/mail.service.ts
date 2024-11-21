import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Response } from 'express';
import { DatabaseService } from 'src/database/database.service';
import { mailQueries } from './mail.queries';
import { successhandler, successMessage } from 'src/global/successhandler';
import { map, BehaviorSubject } from 'rxjs';
import { MailRedisUtil } from './util/mailRedisUtil';

@Injectable()
export class MailService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailRedisUtil: MailRedisUtil
  ) {}

  async connectSseAndInitiate(memberId: number, res: Response) {
    const checkUnread = await this.databaseService.query(mailQueries.checkUnreadQuery, [memberId]);
    const data = {
      check: checkUnread.rows[0].result,
      time: new Date()
    };
    const body = successhandler(successMessage.GET_MAIL_ALARM_SUCCESS, data);

    const newSubject = new BehaviorSubject<string>(JSON.stringify(body));
    await this.mailRedisUtil.registerSseRedis(String(memberId), newSubject);
    const getSubject = await this.mailRedisUtil.getSseRedis(String(memberId));

    if (!getSubject) {
      throw new HttpException(
        'SSE 알림 서버에 등록 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    res.on('close', async () => {
      await this.mailRedisUtil.deleteSseRedis(String(memberId));
      res.end();
    });

    return newSubject.asObservable().pipe(map(message => ({ data: message })));
  }

  @OnEvent('sendAlarm')
  async handleAlarmEventObs(memberId: string) {
    const userSubject = await this.mailRedisUtil.getSseRedis(memberId);
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
      return response.rows;
    } catch (error) {
      throw new HttpException('메일 기록을 가져오는 도중에 에러 발생 : ', error);
    }
  }

  async deleteAllMailByMemberId(memberId: number) {
    try {
      const response = await this.databaseService.query(mailQueries.deleteMailQuery, [memberId]);
      return response;
    } catch (error) {
      throw new HttpException('메일 기록을 삭제하는 도중에 에러 발생 : ', error);
    }
  }
}
