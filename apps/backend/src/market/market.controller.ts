import { Controller, Get, Param } from '@nestjs/common';
import { MarketService } from './market.service';
import { Public } from '../global/utils/jwtAuthGuard';
import {
  cropNameInfoResponseDecorator,
  cropPriceInfoResponseDecorator
} from './decorator/crop.decorator';
import { successhandler, successMessage } from '../global/successhandler';

@Controller('api/market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get('crop/price/:cropId')
  @Public()
  @cropPriceInfoResponseDecorator()
  async getPrice(@Param('cropId') crop: number) {
    const data = await this.marketService.getCropPrice(crop);
    return successhandler(successMessage.GET_CROP_PRICE_INFO_SUCCESS, data);
  }

  @Get('crop/prices')
  @Public()
  @cropPriceInfoResponseDecorator()
  async getAllPrices() {
    const data = await this.marketService.getAllCropPrices();
    return successhandler(successMessage.GET_ALL_CROP_PRICE_INFO_SUCCESS, data);
  }

  @Get('crops')
  @Public()
  @cropNameInfoResponseDecorator()
  async getCropsInfo() {
    const data = await this.marketService.getCropsInfo();
    return successhandler(successMessage.GET_CROPS_NAME_INFO_SUCCESS, data);
  }
}
