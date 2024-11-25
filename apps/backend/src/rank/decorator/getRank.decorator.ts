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
      type: GetRankSuccessResponseDto,
      examples: {
        success: {
          summary: '랭킹이 있는 경우',
          value: {
            code: 200,
            message: '현재 랭킹을 조회했습니다.',
            data: {
              rank: 5,
              percentage: 50
            }
          }
        },
        noRank: {
          summary: '랭킹이 갱신되지 않은 경우',
          value: {
            code: 200,
            message: '현재 랭킹을 조회했습니다.',
            data: {
              rank: -1,
              percentage: null
            }
          }
        }
      }
    })
  );
}
