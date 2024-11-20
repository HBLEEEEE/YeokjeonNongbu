export const lottoQueries = {
  getMemberCash: 'SELECT available_cash FROM members WHERE member_id = ($1)',
  setMemberCash: 'UPDATE members SET available_cash = ($1) WHERE member_id = ($2)',
  insertTicket: 'INSERT INTO tickets (rank) VALUES ($1)',
  clearTicketsTable: 'TRUNCATE TABLE tickets RESTART IDENTITY',
  findUnsoldPosition:
    'SELECT ticket_id, rank FROM tickets WHERE sold = false ORDER BY ticket_id ASC LIMIT 1',
  checkToTrue: 'UPDATE tickets SET sold = true WHERE ticket_id = ($1)',
  registerWinner: 'INSERT INTO lotto_count (member_id) VALUES ($1)',
  startLottoCount: 'INSERT INTO lottos (member_id) VALUES ($1)',
  findLottoHistory:
    'SELECT member_id, first_count, second_count, third_count, fourth_count, fifth_count FROM lottos WHERE member_id = ($1)'
};
