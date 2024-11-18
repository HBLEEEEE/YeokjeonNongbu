import { Controller, Delete, Get, Param, Req, Res, Sse, UseGuards } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MailService } from './mail.service';
import { Response } from 'express';
import { successhandler, successMessage } from 'src/global/successhandler';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MailCheckResponseDto } from './dto/mailCheck.dto';
import { JwtAuthGuard } from 'src/global/utils/jwtAuthGuard';
import { MailResponseDto } from './dto/mail.dto';

@Controller('api/mail')
@ApiBearerAuth()
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @UseGuards(JwtAuthGuard)
  @Sse('awsaws')
  @ApiOperation({ summary: '알림 연결 요청 API' })
  @ApiResponse({
    status: 200,
    description: 'Connect Alarm server',
    type: MailCheckResponseDto
  })
  initialConnectSse(@Req() req: any, @Res() res: Response) {
    return this.mailService.connectSseAndInitiate(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Sse('check/obs')
  initialCheckAndConnectSseObs(@Req() req: any) {
    return this.mailService.getSseSubject(req.user.memberId);
  }

  @Get('call/obs/:memberId')
  triggerAlarmObs(@Param('memberId') memberId: number) {
    this.eventEmitter.emit('sendAlarmObs', memberId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('check')
  @ApiOperation({ summary: '알림 연결 요청 API' })
  @ApiResponse({
    status: 200,
    description: 'Connect Alarm server',
    type: MailCheckResponseDto
  })
  initialCheckAndConnectSse(@Req() req: any, @Res() res: Response) {
    this.mailService.checkMailAndConnectSse(req, res);
  }

  @Get('call/:memberId')
  @ApiOperation({ summary: '알림 발생 요청 API' })
  @ApiResponse({
    status: 200,
    description: 'Alarm event occur',
    type: MailCheckResponseDto
  })
  triggerAlarm(@Param('memberId') memberId: number) {
    this.eventEmitter.emit('sendAlarm', memberId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: '알림 조회 요청 API' })
  @ApiResponse({
    status: 200,
    description: 'Get mails by member information',
    type: MailResponseDto
  })
  async getMailsByMemberId(@Req() req: any) {
    const data = await this.mailService.getMailsByMemberId(req.user.memberId);
    return successhandler(successMessage.GET_MAIL_SUCCESS, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiResponse({
    status: 200,
    description: 'Delete all mails by member information',
    schema: {
      example: {
        code: 200,
        message: '메일 삭제를 완료했습니다.'
      }
    }
  })
  @ApiOperation({ summary: '알림 삭제 요청 API' })
  async deleteMailsByMemberId(@Req() req: any) {
    await this.mailService.deleteAllMailByMemberId(req.user.memberId);
    return successhandler(successMessage.DELETE_MAIL_SUCCESS);
  }
}
