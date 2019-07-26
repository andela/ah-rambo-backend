import { config } from 'dotenv';

config();

const development = {
  use_env_variable: 'DB_URL_DEV',
  dialect: 'postgres'
};

const test = {
  user: 'root',
  password: null,
  database: 'database_test',
  host: '127.0.0.1',
  dialect: 'sqlite'
};

const production = {
  use_env_variable: process.env.HEROKU_POSTGRESQL_TEAL_URL,
  dialect: 'postgres'
};

export { development, test, production };
