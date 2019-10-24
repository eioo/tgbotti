import * as dotenv from 'dotenv';

dotenv.config();

function loadEnvVariable(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Could not load environment variable: ${name}`);
  }

  return value;
}

export const config = {
  botToken: loadEnvVariable('BOT_TOKEN'),
  postgresConnectionString: loadEnvVariable('POSTGRES_CONNECTION_STRING'),
};
