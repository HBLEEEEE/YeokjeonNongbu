import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({
    description: '사용자의 이메일 주소',
    example: 'user@example.com'
  })
  email: string;

  @ApiProperty({
    description: '사용자의 비밀번호',
    example: 'password1234'
  })
  password: string;

  @ApiProperty({
    description: '사용자의 닉이름',
    example: '닉네임'
  })
  nickname: string;
}
