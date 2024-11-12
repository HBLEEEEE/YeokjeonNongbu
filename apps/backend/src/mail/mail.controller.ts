import { Controller, Get, Param } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get(':memberId')
  getMailsByMemberId(@Param('memberId')memberId: number): any {
    return this.mailService.GetMailsByMemberId(memberId);
  }
}
