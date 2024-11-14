import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { successhandler, successMessage } from 'src/global/successhandler';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: '회원가입 API' })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공'
  })
  async signUp(@Body() signUpDto: SignUpDto) {
    await this.authService.singUp(signUpDto);
    return successhandler(successMessage.GET_MEMBER_SUCCESS);
  }
}
