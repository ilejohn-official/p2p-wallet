import type { Knex } from "knex";
import envVariables from "./src/config/index";
const {dbClient, dbUser, dbPassword, dbDatabase, dbDatabaseTest, dbUrl} = envVariables;

const config: { [key: string]: Knex.Config } = {
  development: {
    client: dbClient,
    connection: {
      database: dbDatabase,
      user: dbUser,
      password: dbPassword
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations",
      directory: './database/migrations',
    },
    seeds: {
      directory: './database/seeders'
    }
  },

  test: {
    client: dbClient,
    connection: {
      database: dbDatabaseTest,
      user: dbUser,
      password: dbPassword
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations",
      directory: './database/migrations',
    },
    seeds: {
      directory: './database/seeders'
    }
  },

  production: {
    client: dbClient,
    connection: {
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false },
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations",
      directory: './database/migrations',
    },
    seeds: {
      directory: './database/seeders'
    }
  }

};

export default config;
