import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import * as os from 'os';

@Injectable()
export class MailRedisUtil {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType) {}

  async registerSseRedis(key: string) {
    const networkInterfaces = os.networkInterfaces();
    let ip;
    for (const interfaceName in networkInterfaces) {
      const networkInfo = networkInterfaces[interfaceName];
      if (networkInfo) {
        const ipv4 = networkInfo.find(info => info.family === 'IPv4' && !info.internal);
        if (ipv4) {
          ip = ipv4.address;
          break;
        }
      }
    }
    console.log(`ip : ${ip}`);
    console.log(String(ip));
    await this.redisClient.set(key, String(ip));
  }

  async getSseRedis(key: string) {
    const value = await this.redisClient.get(key);
    if (value === null) {
      return null;
    }

    return value;
  }

  async deleteSseRedis(key: string) {
    const exists = await this.redisClient.exists(key);
    if (exists) {
      await this.redisClient.del(key);
    } else {
      throw new HttpException(
        '해당 유저의 알림 연결을 삭제를 할 수 없습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
