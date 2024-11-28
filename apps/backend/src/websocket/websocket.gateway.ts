import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { DatabaseService } from '../database/database.service';

@WebSocketGateway({ cors: true })
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private clients: Map<string, Socket> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  constructor(
    private readonly databaseService: DatabaseService,
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType
  ) {
    this.initializePubSub();
  }

  afterInit() {
    console.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket) {
    client.on('join', async data => {
      const { cropId } = data;
      if (cropId) {
        this.clients.set(client.id, client);
        client.join(String(cropId));
        this.sendCurrentMarketState(client, cropId);

        await this.sendInitialData(cropId);
        this.startDataPolling(cropId);
      }
    });
  }

  handleDisconnect(client: Socket) {
    this.clients.delete(client.id);
    this.stopDataPolling(client.id);
    console.log(`Client disconnected: ${client.id}`);
  }

  private async sendInitialData(cropId: string) {
    const data = await this.databaseService.query(`SELECT * FROM crop_prices WHERE crop_id = $1`, [
      cropId
    ]);
    const formattedData = this.groupDataByMinute(data.rows);
    const chartData = this.fillMissingData(formattedData);

    this.chartDataTransfer(cropId, chartData);
  }

  private startDataPolling(cropId: string) {
    if (!this.intervals.has(cropId)) {
      const interval = setInterval(async () => {
        const data = await this.databaseService.query(
          `SELECT * FROM crop_prices WHERE crop_id = $1`,
          [cropId]
        );
        const formattedData = this.groupDataByMinute(data.rows);
        const chartData = this.fillMissingData(formattedData);

        this.chartDataTransfer(cropId, chartData);
      }, 30000);
      this.intervals.set(cropId, interval);
    }
  }

  private stopDataPolling(clientId: string) {
    this.clients.forEach((_, cropId) => {
      if (!this.clients.has(clientId)) {
        const interval = this.intervals.get(cropId);
        if (interval) {
          clearInterval(interval);
          this.intervals.delete(cropId);
        }
      }
    });
  }

  private groupDataByMinute(rows: any[]) {
    const groupedData: { [minute: number]: { x: Date; y: number } } = {};

    rows.forEach(row => {
      const date = new Date(row.time);
      const minute = Math.floor(date.getTime() / 60000) * 60000;
      groupedData[minute] = { x: new Date(minute), y: Number(row.price) };
    });

    return Object.values(groupedData);
  }

  private fillMissingData(data: { x: Date; y: number }[]): { x: Date; y: number }[] {
    const filledData: { x: Date; y: number }[] = [];
    let lastValue: { x: Date; y: number } | null = null;

    for (let i = 0; i < data.length; i++) {
      const current = data[i];

      if (!lastValue) {
        filledData.push(current);
        lastValue = current;
        continue;
      }

      const timeDiff = current.x.getTime() - lastValue.x.getTime();

      const oneMinute = 60 * 1000;
      if (timeDiff > oneMinute) {
        const numMissingPoints = Math.floor(timeDiff / oneMinute);

        for (let j = 1; j <= numMissingPoints - 1; j++) {
          filledData.push({
            x: new Date(lastValue.x.getTime() + j * oneMinute),
            y: Number(lastValue.y)
          });
        }
      }

      filledData.push(current);
      lastValue = current;
    }

    return filledData;
  }

  async initializePubSub() {
    const subscriber = this.redisClient.duplicate();
    try {
      await subscriber.connect();

      await subscriber.pSubscribe('__keyspace@0__:orderBook:*', async (_, message) => {
        const match = message.match(/orderBook:(\d+):.*/);
        if (match) {
          const cropId = match[1];
          await this.handleRedisUpdate(cropId);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  private async handleRedisUpdate(cropId: string) {
    const buyOrders = await this.redisClient.zRange(`orderBook:${cropId}:buy:limit`, 0, -1);
    const sellOrders = await this.redisClient.zRange(`orderBook:${cropId}:sell:limit`, 0, -1);
    const price = await this.redisClient.hGet(`crop:price`, String(cropId));

    const aggregatedBuyOrders = this.aggregateOrders(buyOrders);
    const aggregatedSellOrders = this.aggregateOrders(sellOrders);

    this.notifyClients(cropId, {
      buyOrders: aggregatedBuyOrders,
      sellOrders: aggregatedSellOrders,
      nowPrice: Number(price)
    });
  }

  private aggregateOrders(rawOrders: string[]): { price: number; quantity: number }[] {
    const orderMap = new Map<number, number>();

    rawOrders.forEach(orderString => {
      const order = JSON.parse(orderString);
      const price = order.price;
      const quantity = order.quantity;

      if (orderMap.has(price)) {
        orderMap.set(price, orderMap.get(price)! + quantity);
      } else {
        orderMap.set(price, quantity);
      }
    });

    return Array.from(orderMap.entries()).map(([price, quantity]) => ({
      price,
      quantity
    }));
  }

  async notifyClients(cropId: string, data: any) {
    this.server.to(cropId).emit('market-update', data);
  }

  async chartDataTransfer(cropId: string, data: any) {
    this.server.to(String(cropId)).emit('chart', data);
  }

  async sendCurrentMarketState(client: Socket, cropId: string) {
    const buyOrders = await this.redisClient.zRange(`orderBook:${cropId}:buy:limit`, 0, -1);
    const sellOrders = await this.redisClient.zRange(`orderBook:${cropId}:sell:limit`, 0, -1);
    const nowPrice = await this.redisClient.hGet('crop:price', String(cropId));

    const aggregatedBuyOrders = this.aggregateOrders(buyOrders);
    const aggregatedSellOrders = this.aggregateOrders(sellOrders);

    client.emit('market-update', {
      buyOrders: aggregatedBuyOrders,
      sellOrders: aggregatedSellOrders,
      nowPrice: Number(nowPrice)
    });
  }
}
