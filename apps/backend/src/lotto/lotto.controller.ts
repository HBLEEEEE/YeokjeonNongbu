import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/global/utils/jwtAuthGuard';
import { LottoService } from './lotto.service';
import { successhandler, successMessage } from 'src/global/successhandler';

@Controller('api/lotto')
@ApiBearerAuth()
export class LottoController {
  constructor(private readonly lottoService: LottoService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: '알림 연결 요청 API' })
  @ApiResponse({
    status: 200,
    description: 'Connect Alarm server'
    // type: MailCheckResponseDto
  })
  buyLotto(@Req() req: any) {
    const memberId = req.user.memberId;
    if (memberId!) {
      throw new Error('올바르지 않은 사용자입니다.');
    }

    const result = this.lottoService.buyLotto(memberId);
    return successhandler(successMessage.BUY_LOTTO_SUCCESS, result);
  }

  @Post('reset')
  resetLotto() {
    this.lottoService.resetLotto();
  }
}
