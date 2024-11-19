import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class LottoService {
  constructor(private readonly databaseService: DatabaseService) {}

  async ttll() {
    return 'awefwaef';
  }
}
