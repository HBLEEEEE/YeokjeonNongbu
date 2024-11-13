import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, QueryResult } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private client: Client;
  constructor(private configService: ConfigService) {}

  onModuleInit() {
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

  async query(query: string, params: string[] = []): Promise<QueryResult> {
    return this.client.query(query, params);
  }

  async close() {
    await this.client.end();
  }
}
