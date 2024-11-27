import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, QueryResult, types } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private client: Client;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    types.setTypeParser(20, val => {
      return Number(val);
    });

    this.client = new Client({
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      user: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME')
    });

    this.client
      .connect()
      .then(() => console.log('Connected to PostgreSQL database'))
      .catch((error: Error) => console.error('Failed to connect to PostgreSQL database', error));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async query(query: string, params: any[] = []): Promise<QueryResult> {
    return this.client.query(query, params);
  }

  async close() {
    await this.client.end();
  }
}
