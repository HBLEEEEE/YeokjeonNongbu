import { DatabaseService } from '../database/database.service';
import { Injectable } from '@nestjs/common';
import { CropPrice } from './dto/cropPrice.dto';

@Injectable()
export class MarketRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllCropsInfo() {
    const query = `
            SELECT *
            FROM crops
        `;

    const result = await this.databaseService.query(query);
    const data = result.rows;

    return data.map(data => ({
      cropId: data.crop_id,
      cropName: data.crop_name
    }));
  }

  async getAllCropsPrice(): Promise<CropPrice[]> {
    const query = `
            SELECT *
            FROM crop_prices
        `;

    const result = await this.databaseService.query(query);

    return result.rows.map(data => ({
      cropId: data.crop_id,
      price: data.price
    }));
  }

  async getCropPrice(cropId: number): Promise<CropPrice | null> {
    const query = `
            SELECT *
            FROM crop_prices
            WHERE crop_id = $1
        `;
    const values = [cropId];

    const result = await this.databaseService.query(query, values);
    const data = result.rows[0];
    if (result.rowCount === 0) {
      return null;
    }

    return {
      cropId: data.crop_id,
      price: data.price
    };
  }
}
