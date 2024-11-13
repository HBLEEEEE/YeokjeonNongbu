import { Controller, Get, Param } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('check/:memberId')
  checkUnreadMailByMemberId(@Param('memberId') memberId: number): any {
    return this.mailService.checkUnreadMailByMemberId(memberId);
  }

  @Get(':memberId')
  getMailsByMemberId(@Param('memberId') memberId: number): any {
    return this.mailService.getMailsByMemberId(memberId);
  }
}
