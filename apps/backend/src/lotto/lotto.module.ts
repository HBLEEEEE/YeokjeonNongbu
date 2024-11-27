import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { LottoController } from './lotto.controller';
import { LottoService } from './lotto.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule],
  controllers: [LottoController],
  providers: [LottoService]
})
export class LottoModule {}
