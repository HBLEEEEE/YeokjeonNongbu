import { Controller, Get, Param } from '@nestjs/common';
import { MarketService } from './market.service';
import { Public } from '../global/utils/jwtAuthGuard';
import { mailResponseDecorator } from './decorator/crop.decorator';
import { successhandler, successMessage } from '../global/successhandler';

@Controller('api/market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get('price/:crop')
  async getPrice(@Param('crop') crop: number) {
    return this.marketService.getCropPrice(crop);
  }

  @Get('crop/prices')
  async getAllPrices() {
    return this.marketService.getAllCropPrices();
  }

  @Get('crops')
  @Public()
  @mailResponseDecorator()
  async getCropsInfo() {
    const data = await this.marketService.getCropsInfo();
    return successhandler(successMessage.GET_CROPS_INFO_SUCCESS, data);
  }
}
