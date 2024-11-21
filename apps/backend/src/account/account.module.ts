import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AccountRepository } from './account.repository';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [AccountController],
  providers: [AccountService, AccountRepository],
  imports: [DatabaseModule]
})
export class AccountModule {}
