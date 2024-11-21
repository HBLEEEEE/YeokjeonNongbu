import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { TokenDecorator } from 'src/global/utils/tokenSwagger';
import { Rank5SuccessResponseDto } from '../dto/top5rank.dto';

export function top5rankResponseDecorator() {
  return applyDecorators(
    TokenDecorator(),
    ApiResponse({
      status: 200,
      description: '5명 조회 성공',
      type: Rank5SuccessResponseDto
    })
  );
}
