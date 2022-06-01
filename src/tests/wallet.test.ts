import request from "supertest";
import app from "../app";
import db from "../../database/db.connection";
import {hashPassword} from "../utils";
import { User } from "../services/UserService";
import {WalletService} from "../services/WalletService";

type dbUser = User & {createdAt?: string, updatedAt?: string}; 
let token: string;
let authUser: dbUser;

// before each request, create a user and log them in
beforeEach(async () => {
  const password = "<ws3P9o-0LL";
  const hashedPassword = await hashPassword(password);
  await db('users').insert({name: "Biola Alfred", email: "biolaalfred@example.com", password: hashedPassword});

  const response = await request(app).post('/login').send({email: "biolaalfred@example.com",  password: password});
  token = response.body.data.token;
  authUser = response.body.data.user;
});

// remove all records
afterEach(async () => {
  await db('users').del();
});

afterAll(async () => {
 await new Promise<void>(resolve => setTimeout(() => resolve(), 10000));
 await db.destroy();
});

describe("Test /wallets route", () => {

  describe("Test POST /wallets route", () => {
        test("Wallet creation ", async () => {

            const response = await request(app).post("/wallets").set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).toBe(201);
            expect(response.body.message).toBe("Wallet created successfully.");
            expect(response.body.data.user_id).toBe(authUser.id);
            expect(response.body.data.pending_debit_balance).toBe('0.00');
            expect(response.body.data.available_balance).toBe('0.00');
            expect(response.body.data.pending_credit_balance).toBe('0.00');

        });

        test("Wallet creation with invalid user", async () => {
            const response = await request(app).post("/wallets").set('Authorization', `Bearer 1nsjeuuuj_some_wrong_token`);

            expect(response.statusCode).toBe(403);
            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('jwt malformed');

        });    

        test("Wallet creation when user already has wallet", async () => {
            const handler = new WalletService(authUser);
            await handler.create();

            const response = await request(app).post("/wallets").set('Authorization', `Bearer ${token}`);
            expect(response.statusCode).toBe(403);
            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('You already have a wallet account.');
  
        });    
    });

});
