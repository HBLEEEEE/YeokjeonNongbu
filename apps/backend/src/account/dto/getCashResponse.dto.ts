import { ApiProperty } from '@nestjs/swagger';
import { AccountCashDto } from './accountMoney.dto';

export class GetCashResponseDto {
  @ApiProperty({
    description: '응답 코드',
    example: 200
  })
  code: number;

  @ApiProperty({
    description: '응답 메세지',
    example: '계정 잔고 조회에 성공했습니다.'
  })
  message: string;

  @ApiProperty({
    description: '응답 데이터',
    type: AccountCashDto,
    isArray: true
  })
  data: AccountCashDto;
}
