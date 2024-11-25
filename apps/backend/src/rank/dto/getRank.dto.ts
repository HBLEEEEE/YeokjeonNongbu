import { ApiProperty } from '@nestjs/swagger';

export class GetRankDataDto {
  @ApiProperty({
    description: '순위',
    example: 33
  })
  rank: number;

  @ApiProperty({
    description: '백분율',
    example: 50
  })
  percentage: number | null;
}

export class GetRankSuccessResponseDto {
  @ApiProperty({
    description: '응답 코드',
    example: 200
  })
  code: number;

  @ApiProperty({
    description: '응답 메세지',
    example: '현재 랭킹을 조회했습니다.'
  })
  message: string;

  @ApiProperty({
    description: '응답 데이터',
    type: GetRankDataDto
  })
  data: GetRankDataDto;
}
