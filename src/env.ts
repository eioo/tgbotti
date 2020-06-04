import * as dotenv from 'dotenv';
import * as envalid from 'envalid';

dotenv.config();

const { str, host, port } = envalid;

export const env = envalid.cleanEnv(process.env, {
  BOT_TOKEN: str(),
  POSTGRES_HOST: host({ default: 'localhost' }),
  POSTGRES_PORT: port({ default: 5432 }),
  POSTGRES_USERNAME: str(),
  POSTGRES_PASSWORD: str(),
  POSTGRES_DATABASE: str(),
  GIPHY_API_KEY: str({ default: undefined }),
});
