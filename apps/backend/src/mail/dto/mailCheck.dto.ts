import { ApiProperty } from '@nestjs/swagger';

export class MailCheckResponseDto {
  @ApiProperty({ example: 200 })
  code: number;

  @ApiProperty({ example: 'Catch alarm!' })
  message: string;

  @ApiProperty({ example: true })
  data: boolean;
}
