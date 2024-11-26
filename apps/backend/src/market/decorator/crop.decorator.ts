import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { CropInfoResponseDto } from '../dto/response/cropInfoResponse.dto';

export function mailResponseDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: '작물 정보 조회 성공',
      type: CropInfoResponseDto
    })
  );
}
