import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { TokenDecorator } from 'src/global/utils/tokenSwagger';
import { UpdateNicknameSuccessResponseDto } from '../dto/updateNickname.dto';

export function updateNicknameResponseDecorator() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: '닉네임 수정 성공',
      type: UpdateNicknameSuccessResponseDto
    }),
    TokenDecorator()
  );
}
