export const mailQueries = {
  checkUnreadQuery:
    'SELECT EXISTS (SELECT 1 FROM mails WHERE member_id = $1 AND read_status = false LIMIT 1) AS result',
  makeReadedQuery: 'UPDATE mails SET read_status=true WHERE member_id = $1',
  getAllmailQuery:
    'SELECT mail_id, content, created_at, read_status FROM mails WHERE member_id = $1',
  createMailQuery:
    'INSERT INTO mails(member_id, content, created_at, read_status) VALUES ($1, $2, NOW(), FALSE);',
  deleteMailQuery: 'DELETE FROM mails WHERE member_id = $1',
  getMemberQuery: 'SELECT EXISTS (SELECT 1 FROM mails WHERE member_id = $1) AS result'
};
