import request from "supertest";
import app from "../app";
import envVariables from "../config";

const {appName} = envVariables;


describe("Test Entry Route", () => {
  test(`Should return the text: ${appName} is Online!`, async () => {
      const response = await request(app).get("/");
      expect(response.text).toBe(`${appName} is Online!`);
  });

  test("Should return the status 200", async () => {
      const response = await request(app).get("/");
      expect(response.statusCode).toBe(200);
  });
});

describe("Test undefined routes", () => {

  test("Should return 404 for route not found", async () => {
      const response = await request(app).get("/some-undefined-route");
      expect(response.statusCode).toBe(404);
  });

  test("Should return Cannot GET /some-undefined-route", async () => {
      const response = await request(app).get("/some-undefined-route");
      expect(response.body.message).toBe("Cannot GET /some-undefined-route");    
  });
});
