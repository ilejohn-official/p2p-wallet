import request from "supertest";
import app from "../app";
import db from "../../database/db.connection";
import {hashPassword} from "../utils";

let token: string;

// before each request, create a user and log them in
beforeEach(async () => {
  const password = "<ws3P9o-0LL";
  const hashedPassword = await hashPassword(password);
  await db('users').insert({name: "Biola Alfred", email: "biolaalfred@example.com", password: hashedPassword});

  const response = await request(app).post('/login').send({email: "biolaalfred@example.com",  password: password});
  token = response.body.data.token;
});

// remove all records
afterEach(async () => {
  await db('users').del();
});

afterAll(async () => {
 await new Promise<void>(resolve => setTimeout(() => resolve(), 10000));
 await db.destroy();
});

describe("Test /users route", () => {
  describe("Test POST /users route", () => {
        test("User creation ", async () => {
             const user = {
                name: "Balton Xhang",
                email: "balton@example.com",
                password: "123456"
              };
 
                 const response = await request(app).post("/users").send(user);
                 expect(response.statusCode).toBe(201);
                 expect(response.body.data.name).toBe(user.name);
                 expect(response.body.data.email).toBe(user.email);

        });

        test("user creation with invalid data", async () => {
          const user = {
             name: "",
             email: "baltonexample.com"
           };

              const response = await request(app).post("/users").send(user);
              expect(response.statusCode).toBe(422);
              expect(response.body.status).toBe('error');
              expect(response.body.message).toBe('Name, email and password required');

        });    
  });

  describe("Test GET /users route", () => {
    test("Fetching all users", async () => {
       const users = [
            { name: 'Martin Albert', email: "martin@example.com", password: "374hen3u2"},
            { name: 'Victoria Smith', email: "victoria@example.com", password: "s0/\/\P4$$w0rD"},
            { name: 'John Doe', email: "john@example.com", password: "£$RFD@%^ndh@"},
            { name: 'Deborah Peters', email: "deborah@example.com", password: "--008mb1_m<"}
        ];
    
        await db('users').insert(users);

        const response = await request(app).get("/users").set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.data.length).toBe(5);

    });

    test("user creation with invalid data", async () => {
      const user = {
         name: "",
         email: "baltonexample.com"
       };

       const response = await request(app).post("/users").send(user);
       expect(response.statusCode).toBe(422);
       expect(response.body.status).toBe('error');
       expect(response.body.message).toBe('Name, email and password required');

    });    
  });
});
