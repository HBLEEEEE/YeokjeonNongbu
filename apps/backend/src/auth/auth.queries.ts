export const authQueries = {
  signUpQuery: 'INSERT INTO members (email, password, nickname) VALUES ($1, $2, $3) RETURNING *'
};
