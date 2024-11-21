import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/global/utils/jwtAuthGuard';
import { LottoService } from './lotto.service';
import { successhandler, successMessage } from 'src/global/successhandler';
import { lottoResponseDecorator } from './decorator/lotto.decorator';
import { MemberData } from 'src/global/utils/requestInterface';
import { Request } from 'express';

@Controller('api/lotto')
@ApiBearerAuth()
export class LottoController {
  constructor(private readonly lottoService: LottoService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: '복권 긁기 요청 API' })
  @lottoResponseDecorator()
  async buyLotto(@Req() req: Request) {
    const { memberId } = req.user as MemberData;
    if (!memberId) {
      throw new Error('올바르지 않은 사용자입니다.');
    }

    const result = await this.lottoService.buyLotto(memberId);
    return successhandler(successMessage.BUY_LOTTO_SUCCESS, result);
  }
}
