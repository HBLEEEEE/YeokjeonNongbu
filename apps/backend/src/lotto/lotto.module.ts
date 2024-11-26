import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { LottoController } from './lotto.controller';
import { LottoService } from './lotto.service';

@Module({
  imports: [DatabaseModule],
  controllers: [LottoController],
  providers: [LottoService]
})
export class LottoModule {}
