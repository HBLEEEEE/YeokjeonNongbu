// import { Inject, Injectable } from '@nestjs/common';
// import { RedisClientType } from 'redis';
// import { BehaviorSubject } from 'rxjs';

// @Injectable()
// export class JwtAuthGuard {
//   constructor(@Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType) {}

//   async registerSseRedis(key: string, value: BehaviorSubject<string>) {
//     const exists = await this.redisClient.exists(key);
//     if (exists) {
//       const resListJson = await this.redisClient.get(key);
//       const resList: string[] = resListJson ? JSON.parse(resListJson) : [];
//     } else {
//       const resList = [value];
//       await this.redisClient.set(key, resList);
//     }
//   }
// }
