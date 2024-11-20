import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { TokenDecorator } from 'src/global/utils/tokenSwagger';
import { updateIntroduceSuccessResponseDto } from '../dto/updateIntroduce.dto';

export function updateIntroduceResponseDecorator() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: '소개글 수정 성공',
      type: updateIntroduceSuccessResponseDto
    }),
    TokenDecorator()
  );
}
