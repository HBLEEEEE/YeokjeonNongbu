import { Module } from '@nestjs/common';
import { MailController } from './mail/mail.controller';
import { MailService } from './mail/mail.service';
import { RedisModule } from './redis/redis.module';
import { MarketModule } from './market/market.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [RedisModule, MarketModule, OrderModule],
  controllers: [MailController],
  providers: [MailService]
})
export class AppModule {}
