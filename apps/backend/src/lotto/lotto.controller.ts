import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/global/utils/jwtAuthGuard';
import { LottoService } from './lotto.service';

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
  initialConnectSse() {
    return this.lottoService.ttll();
  }
}
