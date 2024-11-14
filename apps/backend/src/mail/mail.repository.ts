// import { pool } from '../dbpool/pool';

// export const mailRepository = {
//   //특정 멤버의 안읽은 알림 있는지 확인
//   checkUnreadMailByMemberId: async (memberId: number) => {
//     const query = `SELECT EXISTS (SELECT 1 FROM mails WHERE member_id = ${memberId} AND read_status = false LIMIT 1) AS result`;
//     const response = await pool.query(query);
//     return response.rows[0].result;
//   },
//   //특정 멤버의 모든 알림 읽음으로 처리
//   makeReadedByMemberId: async (memberId: number) => {
//     const query = `UPDATE mails SET read_status=true WHERE member_id = ${memberId}`;
//     const response = await pool.query(query);
//     return response;
//   },
//   //특정 멤버의 안읽은 알림 확인
//   getUnreadMailByMemberId: async (memberId: number) => {
//     const query = `SELECT mail_id, content, created_at, read_status FROM mails WHERE member_id = ${memberId} AND read_status = false;`;
//     const response = await pool.query(query);
//     return response.rows;
//   },
//   //특정 멤버의 모든 알림 확인
//   getAllMailByMemberID: async (memberId: number) => {
//     const query = `SELECT mail_id, content, created_at, read_status FROM mails WHERE member_id = ${memberId}`;
//     const response = await pool.query(query);
//     return response.rows;
//   },
//   //특정 멤버의 특정 알림 확인
//   getMailByMemberIdAndMailId: async (memberId: number, mailId: number) => {
//     const query = `SELECT * FROM mails WHERE member_id = ${memberId} AND mail_id = ${mailId}`;
//     const response = await pool.query(query);
//     return response.rows;
//   },
//   //특정 멤버의 특정 알림 생성
//   createMailFromMemberIdAndContent: async (memberId: number, content: string) => {
//     const query = `INSERT INTO mails(member_id, content, created_at, read_status) VALUES (${memberId}, ${content}, NOW(), FALSE);`;
//     const response = await pool.query(query);
//     return response;
//   },
//   //특정 멤버의 특정 알림 삭제
//   deleteMailByMemberIdAndContent: async (memberId: number, mailId: number) => {
//     const query = `DELETE FROM mails WHERE member_id = ${memberId} AND mail_id = ${mailId}`;
//     const response = await pool.query(query);
//     return response;
//   },
//   //특정 멤버의 전체 알림 삭제
//   deleteAllMailByMemberId: async (memberId: number) => {
//     const query = `DELETE FROM mails WHERE member_id = ${memberId}`;
//     const response = await pool.query(query);
//     return response;
//   }
// };
