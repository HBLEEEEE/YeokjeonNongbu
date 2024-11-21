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
  private sseSubjects: Map<number, BehaviorSubject<string>> = new Map();

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
