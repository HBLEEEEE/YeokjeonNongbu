import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { MailCheckResponseDto } from '../dto/mailCheck.dto';

export function checkResponseDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'SSE 연결 성공',
      type: MailCheckResponseDto
    }),
    ApiResponse({
      status: 400,
      description: '연결에 실패했습니다.',
      content: {
        'application/json': {
          examples: {
            notEnoughCash: {
              summary: 'SSE 연결에 실패했습니다.',
              value: {
                code: 400,
                message: 'SSE 알림 서버에 등록 실패했습니다.'
              }
            }
          }
        }
      }
    })
  );
}
