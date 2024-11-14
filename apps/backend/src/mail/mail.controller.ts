import { Controller, Delete, Get, Param, Res } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MailService } from './mail.service';
import { Response } from 'express';
import { successhandler, successMessage } from 'src/global/successhandler';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MailCheckResponseDto } from './dto/mailCheck.dto';

@Controller('api/mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Get('check/:memberId')
  @ApiOperation({ summary: '알림 연결 요청 API' })
  @ApiResponse({
    status: 200,
    description: 'Alarm response example',
    type: MailCheckResponseDto
  })
  initialCheckAndConnectSse(@Param('memberId') memberId: string, @Res() res: Response) {
    this.mailService.checkMailAndConnectSse(res, memberId);
  }

  @Get('call/:memberId')
  @ApiOperation({ summary: '알림 발생 요청 API' })
  @ApiResponse({
    status: 200,
    description: 'Alarm response example',
    type: MailCheckResponseDto
  })
  triggerAlarm(@Param('memberId') memberId: string) {
    this.eventEmitter.emit('sendAlarm', memberId);
  }

  @Get(':memberId')
  @ApiOperation({ summary: '알림 조회 요청 API' })
  @ApiResponse({
    status: 200,
    description: 'Mail retrieval successful',
    examples: {
      example1: {
        summary: 'Successful mail retrieval',
        value: {
          code: 200,
          message: '메일 조회를 완료했습니다.',
          data: [
            {
              mail_id: '1',
              content: '테스트하는 내용',
              created_at: '2024-11-11T15:00:00.000Z',
              read_status: false
            },
            {
              mail_id: '2',
              content: '테스트하는 내용2',
              created_at: '2024-11-11T15:00:00.000Z',
              read_status: false
            }
          ]
        }
      }
    }
  })
  async getMailsByMemberId(@Param('memberId') memberId: string) {
    const data = await this.mailService.getMailsByMemberId(memberId);
    return successhandler(successMessage.GET_MAIL_SUCCESS, data);
  }

  @Delete(':memberId')
  @ApiResponse({
    status: 200,
    description: 'Alarm response example',
    schema: {
      example: {
        code: 200,
        message: '메일 삭제를 완료했습니다.'
      }
    }
  })
  @ApiOperation({ summary: '알림 삭제 요청 API' })
  async deleteMailsByMemberId(@Param('memberId') memberId: string) {
    await this.mailService.deleteAllMailByMemberId(memberId);
    return successhandler(successMessage.DELETE_MAIL_SUCCESS);
  }
}
