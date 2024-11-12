import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { CropPrice } from './dto/cropPrice.dto';

@Injectable()
export class MarketService {
  private readonly redisKey = 'crop:price';

  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType) {}

  async setCropPrice(data: CropPrice): Promise<void> {
    await this.redisClient.hSet(this.redisKey, data.crop, data.price.toString());
  }

  async getCropPrice(crop: string): Promise<CropPrice | null> {
    const price = await this.redisClient.hGet(this.redisKey, crop);

    if (!price) {
      return null;
    }
    return { crop, price: parseFloat(price) };
  }

  async getAllCropPrices(): Promise<CropPrice[]> {
    const prices = await this.redisClient.hGetAll(this.redisKey);
    return Object.entries(prices).map(([crop, price]) => ({ crop, price: parseFloat(price) }));
  }
}
