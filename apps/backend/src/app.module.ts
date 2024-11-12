import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MarketController } from './market/market.controller';
import { RedisModule } from './redis/redis.module';
import { MarketModule } from './market/market.module';

@Module({
  imports: [RedisModule, MarketModule],
  controllers: [AppController, MarketController],
  providers: [AppService]
})
export class AppModule {}
