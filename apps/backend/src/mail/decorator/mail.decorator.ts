import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { MailResponseDto } from '../dto/mail.dto';

export function mailResponseDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: '유저의 알림을 받아오는데 성공',
      type: MailResponseDto
    }),
    ApiResponse({
      status: 400,
      description: 'DB 연결에 실패했습니다.',
      content: {
        'application/json': {
          examples: {
            dbConnectionError: {
              summary: 'DB 데이터 호출 중 에러 발생',
              value: {
                code: 500,
                message: '메일 기록을 가져오는 도중에 에러 발생 '
              }
            }
          }
        }
      }
    })
  );
}

export function deleteMailResponseDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: '메일 삭제를 완료했습니다.'
    }),
    ApiResponse({
      status: 400,
      description: 'DB 연결에 실패했습니다.',
      content: {
        'application/json': {
          examples: {
            dbConnectionError: {
              summary: 'DB 데이터 호출 중 에러 발생',
              value: {
                code: 500,
                message: '메일 기록을 삭제하는 도중에 에러 발생 '
              }
            }
          }
        }
      }
    })
  );
}
