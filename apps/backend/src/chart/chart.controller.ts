import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { successhandler, successMessage } from 'src/global/successhandler';
import { ChartService } from './chart.service';

@Controller('api/chart')
export class ChartContoller {
  constructor(private readonly chartService: ChartService) {}

  @Get(':cropId')
  @ApiOperation({ summary: '차트 데이터 요청 API' })
  async getChartData(@Param('cropId', ParseIntPipe) cropId: number) {
    const data = await this.chartService.getCropChartData(cropId);
    return successhandler(successMessage.GET_CROP_CHART_DATA_SUCCESS, data);
  }
}
