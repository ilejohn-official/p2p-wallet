import type { Knex } from "knex";
import envVariables from "./src/config/index";
const {dbClient, dbUser, dbPassword, dbDatabase, dbDatabaseTest} = envVariables;

// Update with your config settings.

export const config: { [key: string]: Knex.Config } = {
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
      tableName: "knex_migrations"
    },
    seeds: {
      directory: 'database/seeders'
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
      tableName: "knex_migrations"
    },
    seeds: {
      directory: 'database/seeders'
    }
  },

  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    },
    seeds: {
      directory: '../seeders'
    }
  }

};


