import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { successhandler, successMessage } from 'src/global/successhandler';
import { ApiOperation } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { signUpResponseDecorator } from './decorator/signup.decorator';
import { loginResponseDecorator } from './decorator/login.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: '회원가입 API' })
  @signUpResponseDecorator()
  async signUp(@Body() signUpDto: SignUpDto) {
    await this.authService.signUp(signUpDto);
    return successhandler(successMessage.SIGNUP_SUCCESS);
  }

  @Post('login')
  @ApiOperation({ summary: '로그인 API' })
  @loginResponseDecorator()
  async login(@Body() loginDto: LoginDto) {
    const tokens = await this.authService.login(loginDto);
    return successhandler(successMessage.LOGIN_SUCCESS, tokens);
  }
}
