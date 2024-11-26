import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { ApiOperation } from '@nestjs/swagger';
import { accountCashDecorator } from './decorator/account.decorator';
import { successhandler, successMessage } from '../global/successhandler';
import { JwtAuthGuard } from '../global/utils/jwtAuthGuard';
import { User } from '../global/utils/memberData';

@Controller('api/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('cash')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '회원의 현금 정보 조회' })
  @accountCashDecorator()
  async getCashFromMemberId(@User() user: { memberId: number }) {
    const { memberId } = user;
    const cash = await this.accountService.getCashFromMemberId(memberId);
    return successhandler(successMessage.GET_ACCOUNT_CASH_SUCCESS, cash);
  }
}
