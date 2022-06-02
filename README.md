# Simple P2P Wallet System

## Table of contents

- [General Info](#general-info)
- [External Dependencies](#external-dependencies)
- [Node Packages](#node-packages)
- [Setup](#setup)
- [Usage](#usage)

## General Info

This p2p wallet system is a simple api showing how a wallet system can operate with core fucntionalities.

- Users can register with their email, name and password.
- Users can login with their email and password.
- Registered Users can create a wallet.
- Registered Users can fund their wallets on the system - (Using [\*\*Paystack](https://paystack.com/docs/api/)\*\* funding options. NB: paystack secret key must be set in env file)
- Registered Users can send funds to other users on the system.
- Registered Users can check their balance.

## External Dependencies

- Paystack Transaction initialiser (https://paystack.com/docs/api/#transaction-initialize)
- Paystack Transaction verifier (https://paystack.com/docs/api/#transaction-verify)

## Node Packages

- [Express.js >= 4.18.1](https://www.npmjs.com/package/express "Express JS")
- [Knex > 2.1.0](https://knexjs.org/ "Knex.js")
- [Node-Postgres >= 8.7.3](https://www.npmjs.com/package/pg "node-postgres")
- [Typescript >= 4.7.2](https://www.npmjs.com/package/typescript "typescript")

## Setup

- Clone the project and navigate to it's root path and install the required dependency packages using either of the below commands on the terminal/command line interface

  ```
  npm install
  ```

  or

  ```
  npm ci
  ```

- Copy and paste the content of the .env.example file into a new file named .env in the same directory as the former and set it's  
  values based on your environment's configuration.

- Run migration files

  - Migration for local server

  ```
  npm run migrate:development
  ```

  - Migration for running tests

  ```
  npm run migrate:test
  ```

  - Migration for production

  ```
  npm run migrate
  ```

- Run the user seeder file to populate your database with sample user data. NB: You still need to create a wallet by hitting the `/wallets` endpoint.

  ```
  npm run seed
  ```

## Usage

- To run local server

  ```
  npm run serve
  ```

- To run production build

  ```
  npm run build
  ```

- To run tests

  ```
  npm run test
  ```
