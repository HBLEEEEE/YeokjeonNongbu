import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { WebsocketGateway } from './websocket.gateway';

@Module({
  imports: [DatabaseModule],
  providers: [WebsocketGateway]
})
export class WebsocketModule {}
