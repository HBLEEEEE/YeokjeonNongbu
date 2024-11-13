import { Global, Module } from '@nestjs/common';
import { createClient } from 'redis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async () => {
        const client = createClient({
          url: `redis://localhost:6379`
        });

        await client.connect(); // Redis 연결
        console.log('Connected to Redis at', 'localhost:6379');
        return client;
      }
    }
  ],
  exports: ['REDIS_CLIENT']
})
export class RedisModule {}
