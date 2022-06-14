import request from "supertest";
import app from "../app";
import db from "../../database/db.connection";
import {hashPassword} from "../utils";
import { User } from "../global/interfaces";

let token: string;
let authUser: User;

// before each request, create a user and log them in
beforeEach(async () => {
  const password = "py3bdwhwW";
  const hashedPassword = await hashPassword(password);
  await db('users').insert({name: "Thomas Udderson", email: "thomas@example.com", password: hashedPassword});

  const response = await request(app).post('/login').send({email: "thomas@example.com",  password: password});
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

describe("Test /transactions route", () => {

  describe("Test GET /transactions route", () => {
      test("Get transactions after user funds wallet and transfers", async () => {
            //create wallet for auth user
            const [wallet] = await db('wallets').insert({user_id: authUser.id}, ['id']);

            //mock presence of transactions

            await db("transactions").insert([{
                wallet_id: wallet.id,
                type: 'DEBIT',
                debit: 500.90,
                credit: 0.00,
                narration: 'wallet transfer in process',
                status: 'PENDING',
                meta: JSON.stringify({
                  init_data: 'initPayment.data',
                  final_data: null,
                  email: authUser.email,
                  amount: 500.90,
                  paystack_reference: '2b3y3en3iwmi'
                })
              },{ 
                wallet_id: wallet.id,
                type: 'CREDIT',
                debit: 0.00,
                credit: 450923.00,
                narration: 'wallet funding successful',
                status: 'SUCCESS',
                meta: JSON.stringify({final_data: 'thirdparty'})
              },{
                wallet_id: wallet.id,
                type: 'DEBIT',
                debit: 500.90,
                credit: 0.00,
                narration: 'wallet transfer failed',
                status: 'FAILED'
              }
            ]);

            //retrieve transactions for auth user

            const transactions = await request(app).get("/transactions").set('Authorization', `Bearer ${token}`);

            expect(transactions.statusCode).toBe(200);
            expect(transactions.body.status).toBe("success");
            expect(transactions.body.message).toBe("Transactions retrieved successfully.");
            expect(transactions.body.data.length).toBe(3);
      });
  });

});
