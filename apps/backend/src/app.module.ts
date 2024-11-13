import { Module } from '@nestjs/common';
import { MailController } from './mail/mail.controller';
import { MailService } from './mail/mail.service';

@Module({
  imports: [],
  controllers: [MailController],
  providers: [MailService]
})
export class AppModule {}
