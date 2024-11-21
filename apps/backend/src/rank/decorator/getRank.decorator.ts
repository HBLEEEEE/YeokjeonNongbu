import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { TokenDecorator } from 'src/global/utils/tokenSwagger';
import { GetRankSuccessResponseDto } from '../dto/getRank.dto';

export function getRankResponseDecorator() {
  return applyDecorators(
    TokenDecorator(),
    ApiResponse({
      status: 200,
      description: '랭킹 조회 성공',
      type: GetRankSuccessResponseDto
    })
  );
}
