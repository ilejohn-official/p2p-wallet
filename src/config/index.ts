import 'dotenv/config';

export default {
  port: process.env.APP_PORT,
  appName: process.env.APP_NAME || "P2P-Wallet",
  appEnv: process.env.APP_ENV || "development",
  appKey: process.env.APP_KEY,
  appUrl: process.env.APP_URL,
  dbClient: process.env.DB_CLIENT,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbDatabase: process.env.DB_DATABASE,
  dbDatabaseTest: process.env.DB_DATABASE_TEST,
};
