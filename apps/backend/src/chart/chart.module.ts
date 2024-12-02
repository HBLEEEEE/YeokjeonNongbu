import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from 'src/database/database.module';
import { Chart, ChartSchema } from './model/chart.schema';
import { ChartContoller } from './chart.controller';
import { ChartService } from './chart.service';
import { ChartUtil } from './model/chart.mongo';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Chart.name, schema: ChartSchema }])
  ],
  controllers: [ChartContoller],
  providers: [ChartService, ChartUtil],
  exports: [ChartService]
})
export class ChartModule {}
