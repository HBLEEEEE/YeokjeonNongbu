import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { DatabaseModule } from 'src/database/database.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    DatabaseModule,
    EventEmitterModule.forRoot(),
    JwtModule.register({
      secret: 'jwt',
      signOptions: { expiresIn: '1h' }
    })
  ],
  controllers: [MailController],
  providers: [MailService]
})
export class MailModule {}
