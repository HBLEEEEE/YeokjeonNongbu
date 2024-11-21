import { Injectable } from '@nestjs/common';
import { AccountRepository } from './account.repository';
import { AccountCashDto } from './dto/accountCash.dto';
import { OrderType } from '../order/enums/orderType';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async getCashFromMemberId(memberId: number): Promise<AccountCashDto> {
    return await this.accountRepository.getCashFromMemberId(memberId);
  }

  async updateCashByPlacingOrder(
    memberId: number,
    total_price: number,
    orderType: OrderType
  ): Promise<void> {
    return await this.accountRepository.updateCashByPlacingOrder(orderType, memberId, total_price);
  }

  async updateCashByCompletingOrder(
    memberId: number,
    total_price: number,
    orderType: OrderType
  ): Promise<void> {
    return await this.accountRepository.updateCashByCompletingOrder(
      orderType,
      memberId,
      total_price
    );
  }
}
