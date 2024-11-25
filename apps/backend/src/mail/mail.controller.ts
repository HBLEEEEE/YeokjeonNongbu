import { Controller, Delete, Get, Param, Res, Sse, UseGuards } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MailService } from './mail.service';
import { Response } from 'express';
import { successhandler, successMessage } from 'src/global/successhandler';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/global/utils/jwtAuthGuard';
import { checkResponseDecorator } from './decorator/check.decorator';
import { deleteMailResponseDecorator, mailResponseDecorator } from './decorator/mail.decorator';
import { User } from 'src/global/utils/memberData';

@Controller('api/mail')
@ApiBearerAuth()
export class MailController {
  // private publisher: any;
  // private subscriber: any;
  // private clientSubjects = new Map<string, BehaviorSubject<string>>();

  // async onModuleInit() {
  //   // Redis Publisher와 Subscriber 초기화
  //   this.publisher = createClient({ url: 'redis://localhost:6379' });
  //   this.subscriber = createClient({ url: 'redis://localhost:6379' });

  //   await this.publisher.connect();
  //   await this.subscriber.connect();

  //   // Redis Pub/Sub 메시지 처리
  //   await this.subscriber.subscribe('server-events', (message: string) => {
  //     const { clientId, data } = JSON.parse(message);
  //     const subject = this.clientSubjects.get(clientId);

  //     if (subject) {
  //       subject.next(data); // 해당 클라이언트로 데이터 전달
  //     }
  //   });
  // }

  // @Sse('connect/:clientId')
  // async connect(@Param('clientId') clientId: string) {
  //   // 클라이언트별 BehaviorSubject 생성 및 관리
  //   const subject = new BehaviorSubject<string>('Connected to server');
  //   this.clientSubjects.set(clientId, subject);

  //   // Redis에 클라이언트 정보 등록
  //   const serverInfo = `http://localhost:3000`; // 현재 서버 정보
  //   await this.publisher.set(`client:${clientId}`, serverInfo);

  //   return subject.asObservable().pipe(map(message => ({ data: message }))); // 클라이언트로 Subject 반환
  // }

  // @Post('send')
  // async sendMessage(@Body() body: { clientId: string; data: any }) {
  //   const { clientId, data } = body;

  //   // Redis에서 클라이언트가 연결된 서버 조회
  //   const serverInfo = await this.publisher.get(`client:${clientId}`);
  //   if (!serverInfo) {
  //     throw new Error('Client not found in Redis');
  //   }

  //   if (serverInfo === 'http://localhost:3000') {
  //     // 현재 서버에 연결된 경우
  //     const subject = this.clientSubjects.get(clientId);
  //     if (subject) {
  //       subject.next(data); // 즉시 클라이언트로 데이터 전송
  //     }
  //   } else {
  //     // 다른 서버에 연결된 경우 Pub/Sub을 통해 메시지 전달
  //     await this.publisher.publish('server-events', JSON.stringify({ clientId, data }));
  //   }
  // }

  constructor(
    private readonly mailService: MailService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @UseGuards(JwtAuthGuard)
  @Sse('check')
  @ApiOperation({ summary: '알림 연결 요청 API' })
  @checkResponseDecorator()
  initialConnectSse(@User() user: { memberId: number }, @Res() res: Response) {
    const { memberId } = user;
    return this.mailService.connectSseAndInitiate(memberId, res);
  }

  @Get('event/:memberId')
  eventAlarm(@Param('memberId') memberId: number) {
    this.mailService.startAlarm(memberId);
  }

  @Get('call/:memberId')
  triggerAlarm(@Param('memberId') memberId: number) {
    this.eventEmitter.emit('sendAlarm', memberId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: '알림 조회 요청 API' })
  @mailResponseDecorator()
  async getMailsByMemberId(@User() user: { memberId: number }) {
    const { memberId } = user;
    const data = await this.mailService.getMailsByMemberId(memberId);
    return successhandler(successMessage.GET_MAIL_SUCCESS, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @deleteMailResponseDecorator()
  @ApiOperation({ summary: '알림 삭제 요청 API' })
  async deleteMailsByMemberId(@User() user: { memberId: number }) {
    const { memberId } = user;
    await this.mailService.deleteAllMailByMemberId(memberId);
    return successhandler(successMessage.DELETE_MAIL_SUCCESS);
  }
}
