import { Controller, Delete, Get, Param, Req, Res, Sse, UseGuards } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MailService } from './mail.service';
import { Response } from 'express';
import { successhandler, successMessage } from 'src/global/successhandler';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/global/utils/jwtAuthGuard';
import { checkResponseDecorator } from './decorator/check.decorator';
import { deleteMailResponseDecorator, mailResponseDecorator } from './decorator/mail.decorator';

@Controller('api/mail')
@ApiBearerAuth()
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @UseGuards(JwtAuthGuard)
  @Sse('check')
  @ApiOperation({ summary: '알림 연결 요청 API' })
  @checkResponseDecorator()
  initialConnectSse(@Req() req: any, @Res() res: Response) {
    return this.mailService.connectSseAndInitiate(req, res);
  }

  @Get('call/:memberId')
  triggerAlarmObs(@Param('memberId') memberId: number) {
    this.eventEmitter.emit('sendAlarm', memberId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: '알림 조회 요청 API' })
  @mailResponseDecorator()
  async getMailsByMemberId(@Req() req: any) {
    const data = await this.mailService.getMailsByMemberId(req.user.memberId);
    return successhandler(successMessage.GET_MAIL_SUCCESS, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @deleteMailResponseDecorator()
  @ApiOperation({ summary: '알림 삭제 요청 API' })
  async deleteMailsByMemberId(@Req() req: any) {
    await this.mailService.deleteAllMailByMemberId(req.user.memberId);
    return successhandler(successMessage.DELETE_MAIL_SUCCESS);
  }
}
