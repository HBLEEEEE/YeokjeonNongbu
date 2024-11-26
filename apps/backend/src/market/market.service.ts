import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { CropPrice } from './dto/cropPrice.dto';
import { CropInfo } from './dto/crop.Info';
import { MarketRepository } from './market.repository';

@Injectable()
export class MarketService {
  private readonly redisKey = 'crop:price';

  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
    private readonly marketRepository: MarketRepository
  ) {}

  async setCropPrice(data: CropPrice): Promise<void> {
    await this.redisClient.hSet(this.redisKey, data.cropId, data.price.toString());
  }

  async getCropPrice(cropId: number): Promise<CropPrice | null> {
    const price = await this.redisClient.hGet(this.redisKey, cropId.toString());

    if (!price) {
      return null;
    }
    return { cropId, price: parseFloat(price) };
  }

  async getCropIdFromName(crop: string): Promise<number> {
    const cropId = await this.redisClient.hGet(this.redisKey, crop);
    if (!cropId) {
      return -1;
    }
    return parseInt(cropId);
  }

  async getAllCropPrices(): Promise<CropPrice[]> {
    const prices = await this.redisClient.hGetAll(this.redisKey);
    return Object.entries(prices).map(([cropId, price]) => ({
      cropId: parseInt(cropId),
      price: parseFloat(price)
    }));
  }

  async getCropsInfo(): Promise<CropInfo[]> {
    return await this.marketRepository.getCropsInfo();
  }
}
