import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { GetCashResponseDto } from '../dto/getCashResponse.dto';

export function accountCashDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: '회원 잔고 조회 성공',
      type: GetCashResponseDto
    })
  );
}
