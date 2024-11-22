import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AccountRepository } from './account.repository';
import { DatabaseModule } from '../database/database.module';
import { HasSufficientCashGuard } from './guards/hasSufficientCashGuard';

@Module({
  controllers: [AccountController],
  providers: [AccountService, AccountRepository, HasSufficientCashGuard],
  exports: [AccountService],
  imports: [DatabaseModule]
})
export class AccountModule {}
