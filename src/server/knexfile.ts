// Update with your config settings.
import dotenv from 'dotenv';
import 'ts-node/register';
dotenv.config({ path: './.env' })

const config = {
  development: {
    client: "pg",
    connection: process.env.PG_CONNECTION_STRING,

    migrations: {
      directory: "./knex/migrations",
    },
    
    seeds: {
      directory: "./knex/seeds",
    },
  },

  test: {
    client: "pg",
    connection: process.env.PG_CONNECTION_STRING_TEST,

    migrations: {
      directory: "./knex/migrations",
    },
    
    seeds: {
      directory: "./knex/seeds",
    },
  },

  staging: {
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
    }
  }

};

export default config