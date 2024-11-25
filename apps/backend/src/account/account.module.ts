import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AccountRepository } from './account.repository';
import { DatabaseModule } from '../database/database.module';
import { HasSufficientCashGuard } from './guards/hasSufficientCashGuard';
import { HasSufficientCropGuard } from './guards/hasSufficientCropGuard';

@Module({
  controllers: [AccountController],
  providers: [AccountService, AccountRepository, HasSufficientCashGuard, HasSufficientCropGuard],
  exports: [AccountService],
  imports: [DatabaseModule]
})
export class AccountModule {}
