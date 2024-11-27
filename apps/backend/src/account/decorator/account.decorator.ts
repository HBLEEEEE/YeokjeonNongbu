import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { GetCashResponseDto } from '../dto/getCashResponse.dto';
import { GetCropsByMemberResponseDto } from '../dto/getCropsByMemberResponse.dto';
import { GetCropByMemberResponseDto } from '../dto/getCropByMemberResponse.dto';

export function accountCashDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: '회원 잔고 조회 성공',
      type: GetCashResponseDto
    })
  );
}

export function accountCropDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: '회원 작물 조회 성공',
      type: GetCropByMemberResponseDto
    })
  );
}

export function accountCropsDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 201,
      description: '회원 보유 전체 작물 조회 성공',
      type: GetCropsByMemberResponseDto
    })
  );
}
