import { Global, Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { createClient } from 'redis';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');
        const client = createClient({
          url: redisUrl
        });

        await client.connect();
        console.log('Connected to Redis at', redisUrl);
        return client;
      }
    }
  ],
  exports: ['REDIS_CLIENT']
})
export class RedisModule {}
