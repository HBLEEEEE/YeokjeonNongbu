import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { DatabaseService } from 'src/database/database.service';
import { rankQueries } from './rank.queries';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class RankService {
  constructor(
    private readonly databaseService: DatabaseService,
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType
  ) {}

  async onApplicationBootstrap() {
    await this.storeMoneyRanking();
  }

  @Cron(CronExpression.EVERY_2ND_HOUR)
  async handleCron() {
    await this.storeMoneyRanking();
  }

  async storeMoneyRanking() {
    await this.redisClient.del('ranking');
    const membersMoney = await this.databaseService.query(rankQueries.moneyDataQuery);
    for (const memberMoney of membersMoney.rows) {
      await this.redisClient.zAdd('ranking', {
        score: memberMoney.total_asset,
        value: memberMoney.nickname
      });
    }
  }

  async getTopRankings() {
    const members = await this.redisClient.zRangeWithScores('ranking', -5, -1);
    return members.reverse();
  }

  async getRanking(nickname: string) {
    const rank = await this.redisClient.zRevRank('ranking', nickname);
    if (rank) {
      return {
        rank: rank + 1
      };
    }
    return {
      rank: '해당 유저의 랭킹이 존재 하지 않습니다.'
    };
  }
}
