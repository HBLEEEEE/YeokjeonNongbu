import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { SignUpDto } from './dto/signUp.dto';
import * as bcrypt from 'bcrypt';
import { authQueries } from './auth.queries';

@Injectable()
export class AuthService {
  constructor(private readonly databaseService: DatabaseService) {}

  async singUp(signUpDto: SignUpDto) {
    const { email, password, nickname } = signUpDto;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email))
      throw new HttpException('유효한 이메일 주소를 입력해주세요.', HttpStatus.BAD_REQUEST);

    if (!password || password.length < 8 || password.length > 16)
      throw new HttpException(
        '비밀번호는 8자에서 16자 사이로 입력해주세요.',
        HttpStatus.BAD_REQUEST
      );

    if (!nickname || nickname.length < 2 || nickname.length > 10)
      throw new HttpException('닉네임은 2자에서 10자 사이로 입력해주세요.', HttpStatus.BAD_REQUEST);
    const hashedPassword = await bcrypt.hash(password, 10);

    await this.databaseService.query(authQueries.signUpQuery, [email, hashedPassword, nickname]);
  }
}
