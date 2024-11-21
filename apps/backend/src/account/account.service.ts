import { Injectable } from '@nestjs/common';
import { AccountRepository } from './account.repository';
import { AccountCashDto } from './dto/accountMoney.dto';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async getCashFromMemberId(memberId: number): Promise<AccountCashDto> {
    return await this.accountRepository.getCashFromMemberId(memberId);
  }
}
