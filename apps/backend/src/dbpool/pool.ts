import { Pool } from 'pg';
// import dotenv from 'dotenv';
import 'dotenv/config';

const user = process.env.BACKEND_POSTGRE_USERNAME;
const url = process.env.BACKEND_POSTGRE_URL;
const database = process.env.BACKEND_POSTGRE_DATABASE;
const password = process.env.BACKEND_POSTGRE_PASSWORD;
const port = Number(process.env.BACKEND_POSTGRE_PORT);

export const pool = new Pool({
  user: user,
  host: url,
  database: database,
  password: password,
  port: port
});
