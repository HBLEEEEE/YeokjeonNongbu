import { Module } from '@nestjs/common';
// import { MailController } from './mail/mail.controller';
// import { MailService } from './mail/mail.service';
import { RedisModule } from './redis/redis.module';
import { MarketModule } from './market/market.module';
import { OrderModule } from './order/order.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, RedisModule, MarketModule, OrderModule, ConfigModule.forRoot()],
  controllers: [],
  providers: []
})
export class AppModule {}
