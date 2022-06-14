import request from "supertest";
import app from "../app";
import db from "../../database/db.connection";
import {hashPassword} from "../utils";
import {WalletService} from "../services/WalletService";
import { User } from "../global/interfaces";

let token: string;
let authUser: User;

// before each request, create a user and log them in
beforeEach(async () => {
  const password = "<ws3P9o@0LL";
  const hashedPassword = await hashPassword(password);
  await db('users').insert({name: "Ngozi Wilson", email: "ngozi@example.com", password: hashedPassword});

  const response = await request(app).post('/login').send({email: "ngozi@example.com",  password: password});
  token = response.body.data.token;
  authUser = response.body.data.user;
});

// remove all records
afterEach(async () => {
  await db('users').del();
  await db('wallets').del();
  await db('transactions').del();
});

afterAll(async () => {
 await db.destroy();
});

describe("Test /wallets route", () => {

  describe("Test POST /wallets route", () => {
        test("Wallet creation ", async () => {

            const response = await request(app).post("/wallets").set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).toBe(201);
            expect(response.body.message).toBe("Wallet created successfully.");
            expect(response.body.data.user_id).toBe(authUser.id);
            expect(response.body.data.pending_debit_balance).toBe(0);
            expect(response.body.data.available_balance).toBe(0);
            expect(response.body.data.pending_credit_balance).toBe(0);

        });

        test("Wallet creation with invalid user", async () => {
            const response = await request(app).post("/wallets").set('Authorization', `Bearer 1nsjeuuuj_some_wrong_token`);

            expect(response.statusCode).toBe(403);
            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('jwt malformed');

        });    

        test("Wallet creation when user already has wallet", async () => {
            await (new WalletService(authUser)).create();

            const response = await request(app).post("/wallets").set('Authorization', `Bearer ${token}`);
            expect(response.statusCode).toBe(403);
            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('You already have a wallet account.');
  
        });    
  });

  describe("Test POST /wallets/* routes", () => {
    test("Wallet funding ", async () => {

      await db('wallets').insert({user_id: authUser.id});
      const response = await request(app).post("/wallets/fund").send({amount: 10000.99}).set('Authorization', `Bearer ${token}`);

       expect(response.statusCode).toBe(302);
       expect(response.body.message).toBe("Wallet funding initiated.");
       expect(response.body.status).toBe('success');
       expect(response.body.data).toHaveProperty('authorization_url');
       expect(response.body.data).toHaveProperty('reference');

     });

      test("Wallet funding with invalid data", async () => {
        await db('wallets').insert({user_id: authUser.id});
        const response = await request(app).post("/wallets/fund").send({amount: 'fourty thousand naira'}).set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(422);
        expect(response.body.status).toBe("error");
      });

      test("Wallet transfer ", async () => {
            //create wallet for auth user
            const wallet = await db('wallets').insert({user_id: authUser.id}, ['id']);
            //fund it
            await db('wallets').where('id', wallet[0].id).increment('available_balance', 2000.50);

            const hashedPassword = await hashPassword('2iem34i3i2');

            //create recepient
            const user = await db('users').insert(
              {name: "Eve Daisy", email: "eve@example.com", password: hashedPassword}, 
              ['id', 'email']
            );
            const recepient = user[0];

            //create recepient wallet
            await db('wallets').insert({user_id: recepient.id});

            //transfer
            const response = await request(app).post("/wallets/transfer")
                                    .send({amount : 1000, email: recepient.email})
                                    .set('Authorization', `Bearer ${token}`);
            
            const recepientWallet = await db('wallets').where('user_id', recepient.id).first();
            
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe("Transfer successful.");
            expect(response.body.data.user_id).toBe(authUser.id);
            expect(response.body.data.pending_debit_balance).toBe(0);
            expect(response.body.data.available_balance).toBe(1000.50);
            expect(response.body.data.pending_credit_balance).toBe(0);

            expect(recepientWallet.user_id).toBe(recepient.id);
            expect(recepientWallet.pending_debit_balance).toBe(0);
            expect(recepientWallet.available_balance).toBe(1000);
            expect(recepientWallet.pending_credit_balance).toBe(0);
      });

      test("Wallet transfer with invalid data", async () => {
            
        const wallet = await db('wallets').insert({user_id: authUser.id}, ['id']);
        await db('wallets').where('id', wallet[0].id).increment('available_balance', 2000000);

        const hashedPassword = await hashPassword('2iem34iejej3i2');
        const user = await db('users').insert({name: "Momo Adelaide", email: "momo@example.com", password: hashedPassword}, ['id']);
        await db('wallets').insert({user_id: user[0].id});

        const response = await request(app).post("/wallets/transfer")
                                .send({amount : 569.73, email: 'some_random_stuff@elv.com'})
                                .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe("error");
        expect(response.body.message).toBe("Recepient is not registered");
      });
  });

});
