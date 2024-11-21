import { ApiResponse } from '@nestjs/swagger';
import { TransactionResponseDto } from '../dto/response/transactionResponse.dto';
import { applyDecorators } from '@nestjs/common';

export function transactionResponseDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: '회원 거래 기록 조회 성공',
      type: TransactionResponseDto
    })
  );
}
