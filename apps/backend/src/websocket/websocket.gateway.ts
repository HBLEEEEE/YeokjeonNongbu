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

@WebSocketGateway({ cors: true })
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private clients: Map<string, Socket> = new Map();
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType) {
    this.initializePubSub();
  }

  afterInit() {
    console.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket) {
    client.on('join', data => {
      const { cropId } = data;
      if (cropId) {
        this.clients.set(client.id, client);
        client.join(String(cropId));
        this.sendCurrentMarketState(client, cropId);
      }
    });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
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
      nowPrice: price
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

  async sendCurrentMarketState(client: Socket, cropId: string) {
    const buyOrders = await this.redisClient.zRange(`orderBook:${cropId}:buy:limit`, 0, -1);
    const sellOrders = await this.redisClient.zRange(`orderBook:${cropId}:sell:limit`, 0, -1);
    const nowPrice = await this.redisClient.hGet('crop:price', String(cropId));

    const aggregatedBuyOrders = this.aggregateOrders(buyOrders);
    const aggregatedSellOrders = this.aggregateOrders(sellOrders);

    client.emit('market-update', {
      buyOrders: aggregatedBuyOrders,
      sellOrders: aggregatedSellOrders,
      nowPrice
    });
  }
}
