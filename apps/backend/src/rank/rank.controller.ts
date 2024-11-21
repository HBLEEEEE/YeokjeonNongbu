import { Controller, Get, UseGuards } from '@nestjs/common';
import { RankService } from './rank.service';
import { successhandler, successMessage } from 'src/global/successhandler';
import { JwtAuthGuard } from 'src/global/utils/jwtAuthGuard';
import { ApiOperation } from '@nestjs/swagger';
import { top5rankResponseDecorator } from './decorator/top5rank.decorator';

@UseGuards(JwtAuthGuard)
@Controller('api/rank')
export class RankController {
  constructor(private readonly rankService: RankService) {}

  @ApiOperation({ summary: '상위 랭킹 5명 반환 api' })
  @top5rankResponseDecorator()
  @Get('top5')
  async top5rank() {
    const data = await this.rankService.getTopRankings();
    return successhandler(successMessage.TOP5_RANK_GET_SUCCESS, data);
  }
}
