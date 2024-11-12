import { Controller, Get, Param } from '@nestjs/common';
import { MarketService } from './market.service';

@Controller('api/market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get(':crop/price')
  getPrice(@Param('crop') crop: string) {
    return this.marketService.getCropPrice(crop);
  }

  @Get('crop/prices')
  getAllPrices() {
    return this.marketService.getAllCropPrices();
  }
}
