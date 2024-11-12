import { pool } from '../dbpool/pool';

export const mailRepository = {
  getMailByMemberID: async (memberId: number) => {
    const query = `SELECT mail_id, content, created_at, read_status FROM mails WHERE member_id = ${memberId} AND read_status = false;`;
    const response = await pool.query(query);
    return response.rows;
  },
  createMailFromMemberIdAndContent: async (memberId: number, content: string) => {
    const query = `INSERT INTO mails(member_id, content, created_at, read_status) VALUES (${memberId}, ${content}, NOW(), FALSE);`;
    const response = await pool.query(query);
    console.log(`insert 결과물 : ${response}`);
    return response;
  }
};
