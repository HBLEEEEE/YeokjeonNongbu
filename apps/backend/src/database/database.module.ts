import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [DatabaseService],
  imports: [ConfigModule],
  exports: [DatabaseService]
})
export class DatabaseModule {}
