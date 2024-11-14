import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, signUpResponseDto } from './dto/signUp.dto';
import { successhandler, successMessage } from 'src/global/successhandler';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto, LoginResponseDto } from './dto/login.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: '회원가입 API' })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    type: signUpResponseDto
  })
  async signUp(@Body() signUpDto: SignUpDto) {
    await this.authService.signUp(signUpDto);
    return successhandler(successMessage.SIGNUP_SUCCESS);
  }

  @Post('login')
  @ApiOperation({ summary: '로그인 API' })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: LoginResponseDto
  })
  async login(@Body() loginDto: LoginDto) {
    const tokens = await this.authService.login(loginDto);
    return successhandler(successMessage.LOGIN_SUCCESS, tokens);
  }
}
