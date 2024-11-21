import { ApiProperty } from '@nestjs/swagger';

export class Rank5DataDto {
  @ApiProperty({
    description: '닉네임',
    example: '홍길동'
  })
  nickname: string;

  @ApiProperty({
    description: '점수',
    example: '20000'
  })
  score: number;
}

export class Rank5SuccessResponseDto {
  @ApiProperty({
    description: '응답 코드',
    example: 200
  })
  code: number;

  @ApiProperty({
    description: '응답 메세지',
    example: '상위 5명을 조회했습니다.'
  })
  message: string;

  @ApiProperty({
    description: '응답 데이터',
    type: [Rank5DataDto],
    example: [
      { nickname: '파이썬', score: 50000 },
      { nickname: '자바', score: 40000 },
      { nickname: '자바스크립트', score: 30000 },
      { nickname: '타입스크립트', score: 20000 },
      { nickname: 'C 언어', score: 10000 }
    ]
  })
  data: Rank5DataDto;
}
