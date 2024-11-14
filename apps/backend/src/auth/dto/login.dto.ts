import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: '사용자의 이메일',
    example: 'user@example.com'
  })
  email: string;

  @ApiProperty({
    description: '사용자의 비밀번호',
    example: 'password1234'
  })
  password: string;
}
