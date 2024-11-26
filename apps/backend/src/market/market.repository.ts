import { DatabaseService } from '../database/database.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MarketRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async getCropsInfo() {
    const query = `
            SELECT *
            FROM crops
        `;

    const result = await this.databaseService.query(query);

    return result.rows;
  }
}
