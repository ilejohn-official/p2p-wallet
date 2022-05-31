import request from "supertest";
import app from "../app";
import db from "../../database/db.connection";

// remove all records
afterEach(async () => {
  await db('users').del();
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
});
