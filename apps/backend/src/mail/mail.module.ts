import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { DatabaseModule } from 'src/database/database.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [DatabaseModule, EventEmitterModule.forRoot()],
  controllers: [MailController],
  providers: [MailService]
})
export class MailModule {}
