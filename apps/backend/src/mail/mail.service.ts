import { HttpException, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Response } from 'express';
import { DatabaseService } from 'src/database/database.service';
import { mailQueries } from './mail.queries';
import { successhandler, successMessage } from 'src/global/successhandler';

@Injectable()
export class MailService {
  constructor(private readonly databaseService: DatabaseService) {}
  private connectedClients: Map<string, Response> = new Map();

  async checkMailAndConnectSse(res: Response, memberId: string): Promise<void> {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const checkUnread = await this.databaseService.query(mailQueries.checkUnreadQuery, [memberId]);
    console.log(checkUnread.rows[0].result);
    const data = {
      check: checkUnread.rows[0].result,
      time: new Date()
    };
    const body = successhandler(successMessage.GET_MAIL_ALARM_SUCCESS, data);
    res.write(JSON.stringify(body));
    res.write('\r\n');

    this.connectedClients.set(memberId, res);

    res.on('close', () => {
      this.connectedClients.delete(memberId);
      res.end();
    });
  }

  @OnEvent('sendAlarm')
  handleAlarmEvent(memberId: string): void {
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
