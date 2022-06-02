# Simple P2P Wallet System

## Table of contents

- [General Info](#general-info)
- [External Dependencies](#external-dependencies)
- [Requirements](#requirements)
- [Setup](#setup)
- [Usage](#usage)

## General Info

![DB UML Image](https://raw.githubusercontent.com/ilejohn-official/p2p-wallet/master/DB_UML.png)

This p2p wallet system is a simple api showing how a wallet system can operate with core functionalities.

- Users can register with their email, name and password.
- Users can login with their email and password.
- Registered Users can create a wallet.
- Registered Users can fund their wallets on the system - (Using [\*\*Paystack\*\*](https://paystack.com/docs/api/) funding options. NB: paystack secret key must be set in .env file)
- Registered Users can send funds to other users on the system.
- Registered Users can check their balance.
- Registered Users can see their transaction history.

## External Dependencies

- Paystack Transaction initialiser (https://paystack.com/docs/api/#transaction-initialize)
- Paystack Transaction verifier (https://paystack.com/docs/api/#transaction-verify)

## Requirements

- [Node.js > 16](https://nodejs.org "Node Js")
- [Express.js >= 4.18.1](https://www.npmjs.com/package/express "Express JS")
- [Knex > 2.1.0](https://knexjs.org/ "Knex.js")
- [Node-Postgres >= 8.7.3](https://www.npmjs.com/package/pg "node-postgres")
- [Typescript >= 4.7.2](https://www.npmjs.com/package/typescript "typescript")

## Setup

- Clone the project and navigate to it's root path and install the required dependency packages using either of the below commands on the terminal/command line interface

  ```bash
  git clone https://github.com/ilejohn-official/p2p-wallet.git
  cd p2p-wallet
  ```

  ```
  npm install
  ```

- Ensure you have Typescript installed globally on your machine

  ```
  npm install -g typescript
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

- Run the user seeder file to populate your database with sample user data. NB: You still need to create a wallet by making a POST request to the `/wallets` endpoint.

  ```
  npm run seed
  ```

## Usage

- To run local server

  ```
  npm run serve
  ```

  Visit http://localhost:5000 and you should see 'p2p-wallet is Online!' as response. if you specify `APP_NAME` in your .env file then it would replace `p2p-wallet`

- To run production build

  ```
  npm run build
  ```

- To run tests

  ```
  npm run test
  ```
