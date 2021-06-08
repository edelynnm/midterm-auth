import express from 'express';
import cors from 'cors';
import pool from './pool';
import auth from './auth';

const app = express();
const port = 8080;

pool.connect((err: Error) => {
  if (err) throw new Error('Cannot connect to Postgres');

  app.use(cors())
  app.use(express.json())
  app.use('/api/auth', auth)
  app.listen(port, () => {
      console.log(`Server has started: http://localhost:${port}`);
    });
});
