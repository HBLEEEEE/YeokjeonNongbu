import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { lottoQueries } from './lotto.queries';

@Injectable()
export class LottoService {
  constructor(private readonly databaseService: DatabaseService) {}

  async buyLotto(memberId: string) {
    const data = await this.databaseService.query(lottoQueries.getMemberCash, [memberId]);
    let memberCash = Number(data.rows[0].available_cash);
    const prize: Record<1 | 2 | 3 | 4 | 5, any> = {
      1: [500000, 'first_count'],
      2: [200000, 'second_count'],
      3: [140000, 'third_count'],
      4: [100000, 'fourth_count'],
      5: [0, 'fifth_count']
    };

    if (memberCash < 1000) {
      throw new Error(`구매자의 자본금이 복권 최소 금액 보다 적습니다. 자본금 : ${memberCash}`);
    }

    let unsoldData = await this.databaseService.query(lottoQueries.findUnsoldPosition);
    if (unsoldData.rows.length == 0) {
      await this.resetLotto();
      unsoldData = await this.databaseService.query(lottoQueries.findUnsoldPosition);
    }
    const ticketData = unsoldData.rows[0];
    const rank = ticketData.rank as 1 | 2 | 3 | 4 | 5;

    //판매했다고 표시
    await this.databaseService.query(lottoQueries.checkToTrue, [ticketData.ticket_id]);
    //등수 확인 후 현금에 반영
    memberCash = memberCash - 1000 + prize[rank][0];
    //1등이라면 로또 테이블에 작성
    if (rank == 1) {
      await this.databaseService.query(lottoQueries.registerWinner, [memberId]);
    }
    //멤버의 로또 카운트에 반영, 최초 작성이라면 lottos에 작성 시작해주기
    const memberCountData = await this.databaseService.query(lottoQueries.findLottoHistory, [
      memberId
    ]);
    if (memberCountData.rows.length == 0) {
      await this.databaseService.query(lottoQueries.startLottoCount, [memberId]);
    }

    //최종 결과 데이터 입력하기(회수 카운트, 현금 변화, )
    const query = `UPDATE lottos SET ${prize[rank][1]} = ${prize[rank][1]} + 1 WHERE member_id = ($1)`;
    await this.databaseService.query(query, [memberId]);
    await this.databaseService.query(lottoQueries.setMemberCash, [String(memberCash), memberId]);

    //결과 말아서 리턴해주기
    const responseData = {
      rank: rank,
      remainCash: memberCash,
      time: new Date()
    };

    return responseData;
  }

  async resetLotto() {
    console.log(`시작 시간 : ${new Date()}`);
    this.databaseService.query(lottoQueries.clearTicketsTable);

    const rankDistribution = {
      1: 1,
      2: 2,
      3: 7,
      4: 20,
      5: 970
    };

    const tickets: any[] = [];
    Object.entries(rankDistribution).forEach(([rank, count]) => {
      for (let i = 0; i < count; i++) {
        tickets.push({ rank: parseInt(rank, 10) });
      }
    });

    for (let i = tickets.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tickets[i], tickets[j]] = [tickets[j], tickets[i]];
    }
    try {
      for (const ticket of tickets) {
        await this.databaseService.query(lottoQueries.insertTicket, [ticket.rank]);
      }
    } catch (err) {
      console.error('데이터 삽입 중 오류 발생 : ', err);
    } finally {
      console.log(`끝 시간 : ${new Date()}`);
    }
  }
}
