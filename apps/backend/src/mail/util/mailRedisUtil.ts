import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class JwtAuthGuard {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType) {}

  async registerSseRedis(key: string, value: BehaviorSubject<string>) {
    await this.redisClient.set(key, value.getValue());
  }

  async getSseRedis(key: string) {
    const value = await this.redisClient.get(key);
    if (value === null) {
      return null;
    }

    const subject = new BehaviorSubject<string>(value);
    return subject;
  }

  async deleteSseRedis(key: string) {
    const exists = await this.redisClient.exists(key);
    if (exists) {
      await this.redisClient.del(key);
    } else {
      throw new HttpException(
        '해당 유저의 알림 삭제를 할 수 없습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
