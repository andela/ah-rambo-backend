import { config } from 'dotenv';

config();

const development = {
  use_env_variable: 'DB_URL_DEV',
  dialect: 'postgres',
  logging: false
};

const test = {
  storage: ':memory',
  dialect: 'sqlite'
};

const production = {
  use_env_variable: 'DATABASE_URL',
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: true
  }
};

export { development, test, production };
