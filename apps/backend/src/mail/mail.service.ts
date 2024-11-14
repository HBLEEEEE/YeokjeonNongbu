// import { Injectable } from '@nestjs/common';
// import { mailRepository } from './mail.repository';
// import { OnEvent } from '@nestjs/event-emitter';
// import { Response } from 'express';

// @Injectable()
// export class MailService {
//   private connectedClients: Map<number, Response> = new Map();

//   async checkMailAndConnectSse(res: Response, memberId: number): Promise<void> {
//     res.setHeader('Content-Type', 'text/event-stream');
//     res.setHeader('Cache-Control', 'no-cache');
//     res.setHeader('Connection', 'keep-alive');

//     const checkUnread = await mailRepository.checkUnreadMailByMemberId(memberId);
//     res.write(`${checkUnread}\n\n`);

//     this.connectedClients.set(memberId, res);

//     res.on('close', () => {
//       this.connectedClients.delete(memberId);
//       res.end();
//     });
//   }

//   @OnEvent('sendAlarm')
//   handleAlarmEvent(memberId: number): void {
//     const clientRes = this.connectedClients.get(memberId);
//     if (clientRes) {
//       clientRes.write(`true\n\n`);
//     } else {
//       console.log(`[mail] ${memberId} 회원으로 알림을 주어야하는데 Response가 없습니다.`);
//     }
//   }

//   async getMailsByMemberId(memberId: number): Promise<any> {
//     const response = await mailRepository.getUnreadMailByMemberId(memberId);
//     mailRepository.makeReadedByMemberId(memberId);
//     return response;
//   }

//   async deleteAllMailByMemberId(memberId: number): Promise<any> {
//     const response = await mailRepository.deleteAllMailByMemberId(memberId);
//     return response;
//   }
// }
