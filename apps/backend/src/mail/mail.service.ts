import { Injectable } from '@nestjs/common';
import { mailRepository } from './mail.repository';

@Injectable()
export class MailService {
  getHello(): string {
    return 'Hello World!';
  }

  async GetMailsByMemberId(memberId: number): Promise<any> {
    const response = await mailRepository.getMailByMemberID(memberId);
    return response;
  }
}
