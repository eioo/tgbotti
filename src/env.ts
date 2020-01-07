import * as dotenv from 'dotenv';

dotenv.config();

function loadEnvVariable(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Could not load environment variable: ${name}`);
  }

  return value;
}

export const env = {
  botToken: loadEnvVariable('BOT_TOKEN'),
  postgres: {
    host: loadEnvVariable('POSTGRES_HOST') || 'localhost',
    port: Number(loadEnvVariable('POSTGRES_PORT')) || 5432,
    username: loadEnvVariable('POSTGRES_USERNAME'),
    password: loadEnvVariable('POSTGRES_PASSWORD'),
    database: loadEnvVariable('POSTGRES_DATABASE'),
  },
};
