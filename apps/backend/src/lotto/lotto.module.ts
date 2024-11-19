import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { LottoController } from './lotto.controller';
import { LottoService } from './lotto.service';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: 'jwt',
      signOptions: { expiresIn: '1h' }
    })
  ],
  controllers: [LottoController],
  providers: [LottoService]
})
export class LottoModule {}
