import request from "supertest";
import app from "../app";
import db from "../../database/db.connection";
import {hashPassword} from "../utils";

// remove all records
afterEach(async () => {
  await db('users').del();
});

afterAll(async () => {
 await db.destroy();
});

describe("Test auth routes", () => {
  describe("Test POST /login route", () => {
        test("Login user", async () => {

            let password = "123456";
            let hashedPassword = await hashPassword(password);
             const user = {
                name: "Balton Xhang",
                email: "balton@example.com",
                password: hashedPassword
              };
              
              await db('users').insert(user);
 
              const response = await request(app).post("/login").send({email: user.email, password: password});
              expect(response.statusCode).toBe(200);
              expect(response.body.data.user.name).toBe(user.name);
              expect(response.body.data.user.email).toBe(user.email);
              expect(response.body.data.token).toBeDefined();
              expect(response.body.data).toHaveProperty('token');

        });

        test("Login with wrong data", async () => {

            let password = "s-9i5%rQ";
            let hashedPassword = await hashPassword(password);
            const user = { 
                name: 'Greg Margaret', 
                email: "greg@example.com", 
                password: hashedPassword
            }

              await db('users').insert(user);
 
              const response = await request(app).post("/login").send({email: 'gregexample.com', password: 'wrong'});
              expect(response.statusCode).toBe(400);
              expect(response.body.status).toBe('error');
              expect(response.body.message).toBe("\"email\" must be a valid email. \"password\" length must be at least 6 characters long");

        });
        
        test("Login with invalid data", async () => {

          let password = "s-9ik&%dnwje";
          let hashedPassword = await hashPassword(password);
          const user = { 
              name: 'Allison Scot', 
              email: "scot@example.com", 
              password: hashedPassword
          }

            await db('users').insert(user);

            const response = await request(app).post("/login").send({email: 'scot@example.com', password: 'wrong_password'});
            expect(response.statusCode).toBe(400);
            expect(response.body.status).toBe('error');
            expect(response.body.message).toBe('Password not valid');

      });  
  });

  describe("Test POST /logout route", () => {
    test("Logout user", async () => {

        const password = "2ws3P9o-";
        const hashedPassword = await hashPassword(password);
        await db('users').insert({name: "Biola Alfred", email: "biolaalfred@example.com", password: hashedPassword});

        const loggedIn = await request(app).post('/login').send({email: "biolaalfred@example.com", password: password});
        const token = loggedIn.body.data.token;
        
        const response = await request(app).post("/logout").set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.message).toBe('Clear token from Api request header');

    });

    test("Logout when not logged in", async () => {

          const response = await request(app).post("/logout");
          expect(response.statusCode).toBe(403);
          expect(response.body.status).toBe('error');
          expect(response.body.message).toBe('unauthorised access');

    });    
  });
});
