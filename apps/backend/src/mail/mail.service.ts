import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Response } from 'express';
import { DatabaseService } from 'src/database/database.service';
import { mailQueries } from './mail.queries';
import { successhandler, successMessage } from 'src/global/successhandler';
import { Observable, map, BehaviorSubject } from 'rxjs';

@Injectable()
export class MailService {
  constructor(private readonly databaseService: DatabaseService) {}
  private connectedClients: Map<string, Response> = new Map();
  private sseSubject: Map<string, BehaviorSubject<string>> = new Map();

  connectSseAndInitiate(req: any, res: Response) {
    const memberId = req.user.memberId;
    if (!this.sseSubject.has(memberId)) {
      const newSubject = new BehaviorSubject<string>(`초기알람가즈아!! : ${new Date()}`);
      this.sseSubject.set(memberId, newSubject);
    }

    const userSubject = this.sseSubject.get(memberId);
    if (!userSubject) {
      throw new Error('이거 왜 안되지');
    }

    res.on('close', () => {
      this.sseSubject.delete(memberId);
      res.end();
    });

    return userSubject.asObservable().pipe(map(message => ({ data: message })));
  }

  getSseSubject(memberId: string): Observable<{ data: string }> {
    if (!this.sseSubject.has(memberId)) {
      const newSubject = new BehaviorSubject<string>(`초기알람가즈아!! : ${new Date()}`);
      this.sseSubject.set(memberId, newSubject);
    }

    const userSubject = this.sseSubject.get(memberId);
    if (!userSubject) {
      throw new Error('이거 왜 안되지');
    }

    return userSubject.asObservable().pipe(map(message => ({ data: message })));
  }

  @OnEvent('sendAlarmObs')
  handleAlarmEventObs(memberId: string) {
    const userSubject = this.sseSubject.get(memberId);
    if (!userSubject) {
      throw new Error(`이 멤버아이디로는 생성이 안된다요.`);
    }
    userSubject.next(`알림이 갔다리 : ${new Date()}`);
  }

  async checkMailAndConnectSse(req: any, res: Response) {
    const memberId = req.user.memberId;

    const memberExist = await this.databaseService.query(mailQueries.getMemberQuery, [memberId]);
    if (!memberExist) {
      throw new HttpException('요청하신 유저에 대한 정보가 없습니다', HttpStatus.NOT_FOUND);
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const checkUnread = await this.databaseService.query(mailQueries.checkUnreadQuery, [memberId]);
    const data = {
      check: checkUnread.rows[0].result,
      time: new Date()
    };
    const body = successhandler(successMessage.GET_MAIL_ALARM_SUCCESS, data);
    res.write(JSON.stringify(body));
    res.write('\r\n');

    console.log(memberId);
    this.connectedClients.set(memberId, res);
    console.log(this.connectedClients);

    res.on('close', () => {
      this.connectedClients.delete(memberId);
      res.end();
    });
  }

  @OnEvent('sendAlarm')
  handleAlarmEvent(memberId: string) {
    const clientRes = this.connectedClients.get(memberId);

    if (clientRes) {
      const data = {
        check: true,
        time: new Date()
      };
      const body = successhandler(successMessage.GET_MAIL_ALARM_SUCCESS, data);
      clientRes.write(JSON.stringify(body));
      clientRes.write('\r\n');
    } else {
      console.log('없다닌까요!');
    }
  }

  async getMailsByMemberId(memberId: string) {
    try {
      const response = await this.databaseService.query(mailQueries.getAllmailQuery, [memberId]);
      return response.rows;
    } catch (error) {
      throw new HttpException('메일 기록을 가져오는 도중에 에러 발생 : ', error);
    }
  }

  async deleteAllMailByMemberId(memberId: string) {
    try {
      const response = await this.databaseService.query(mailQueries.deleteMailQuery, [memberId]);
      return response;
    } catch (error) {
      throw new HttpException('메일 기록을 삭제하는 도중에 에러 발생 : ', error);
    }
  }
}
