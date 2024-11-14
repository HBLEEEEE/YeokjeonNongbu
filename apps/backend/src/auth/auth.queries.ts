export const authQueries = {
  signUpQuery: 'INSERT INTO members (email, password, nickname) VALUES ($1, $2, $3) RETURNING *',
  findByEmailQuery: 'SELECT email, password FROM members WHERE email = $1 LIMIT 1'
};
