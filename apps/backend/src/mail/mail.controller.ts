import { Controller, Delete, Get, Param, Res } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MailService } from './mail.service';
import { Response } from 'express';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  // 여기서 부터는 알림만 다루는 API, 알림을 주는 것과 알림 내용을 주는 것은 별도입니다.

  // SSE를 연결하고 읽지 않은 알람이 있다면 True를 없다면 false를 반환\
  // 알림이 어떻게 작동되는지는 아래 eventEmitter와 mail.service의 OnEvent를 참고해주세요.
  @Get('check/:memberId')
  initialCheckAndConnectSse(@Param('memberId') memberId: number, @Res() res: Response): void {
    this.mailService.checkMailAndConnectSse(res, memberId);
  }

  // SSE가 연결된 곳에 그냥 true를 날리는 개발용 API
  @Get('call/:memberId')
  triggerAlarm(@Param('memberId') memberId: number): void {
    this.eventEmitter.emit('sendAlarm', memberId);
  }
  // 알림 API 끝

  // 여기서부터는 알림 내역과 관련된 API입니다.

  // 알림 내역을 보내는 API, 읽지 않은 알림은 읽음 처리가 됩니다.
  @Get(':memberId')
  getMailsByMemberId(@Param('memberId') memberId: number): any {
    return this.mailService.getMailsByMemberId(memberId);
  }

  // 특정 멤버의 전체 알림 기록 삭제
  @Delete(':memberId')
  deleteMailsByMemberId(@Param('memberId') memberId: number): any {
    return this.mailService.deleteAllMailByMemberId(memberId);
  }
}
