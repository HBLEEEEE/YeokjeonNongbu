import { Injectable } from '@nestjs/common';
import { mailRepository } from './mail.repository';

@Injectable()
export class MailService {
  async getMailsByMemberId(memberId: number): Promise<any> {
    const response = await mailRepository.getUnreadMailByMemberId(memberId);
    return response;
  }

  async checkUnreadMailByMemberId(memberId: number): Promise<any> {
    const response = await mailRepository.checkUnreadMailByMemberId(memberId);
    return response;
  }
}
