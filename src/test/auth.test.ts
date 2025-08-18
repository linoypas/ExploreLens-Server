import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import userModel, { IUser } from "../models/user_model";

var app: Express;

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  await userModel.deleteMany();
});

afterAll((done) => {
  console.log("afterAll");
  mongoose.connection.close();
  done();
});

const baseUrl = "/auth";

type User = IUser & {
  accessToken?: string;
  refreshToken?: string;
};

const testUser: User = {
  email: "test@user.com",
  password: "testpassword",
  profilePicture: "",
  username: "test1" 
};

describe("Auth Tests", () => {
  test("Register and return tokens", async () => {
    const response = await request(app)
      .post(baseUrl + "/register")
      .send({
        name: "test1",
        email: testUser.email,
        password: testUser.password,
        profilePicture: testUser.profilePicture
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    expect(response.body._id).toBeDefined();
    testUser.accessToken = response.body.accessToken;
    testUser.refreshToken = response.body.refreshToken;
    testUser._id = response.body._id;
  });

  test("Fail duplicate register", async () => {
    const response = await request(app)
      .post(baseUrl + "/register")
      .send({
        name: "test1",
        email: testUser.email,
        password: testUser.password,
        profilePicture: testUser.profilePicture
      });
    expect(response.statusCode).toBe(409);
  });

  test("Fail invalid register data", async () => {
    const cases = [
      { email: "", name: "", password: "" },
      { email: "", name: "user", password: "pass" },
      { email: "user@example.com", name: "", password: "pass" },
      { email: "user@example.com", name: "user", password: "" }
    ];
    for (const data of cases) {
      const res = await request(app).post(baseUrl + "/register").send(data);
      expect(res.statusCode).toBe(400);
    }
  });

  test("Login and receive tokens", async () => {
    const response = await request(app)
      .post(baseUrl + "/login")
      .send({
        email: testUser.email,
        password: testUser.password
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    expect(response.body._id).toBeDefined();
    testUser.accessToken = response.body.accessToken;
    testUser.refreshToken = response.body.refreshToken;
  });

  test("Login fail - wrong credentials", async () => {
    const response = await request(app).post(baseUrl + "/login").send({
      email: testUser.email,
      password: "wrongPassword"
    });
    expect(response.statusCode).toBe(400);
  });

  test("Refresh token flow", async () => {
    const response = await request(app)
      .post(baseUrl + "/refresh")
      .send({ refreshToken: testUser.refreshToken });
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    testUser.accessToken = response.body.accessToken;
    testUser.refreshToken = response.body.refreshToken;
  });

  let staleToken: string; 

  test("Logout with refresh token", async () => {
    staleToken = testUser.refreshToken!; 
    const response = await request(app)
      .post(baseUrl + "/logout")
      .send({ refreshToken: staleToken });
    expect(response.statusCode).toBe(200);
  });
  
  test("Refresh fails after logout", async () => {
    const response = await request(app)
      .post(baseUrl + "/refresh")
      .send({ refreshToken: staleToken }); 
    expect(response.statusCode).not.toBe(200);
  });
  

  test("Forgot password sends email", async () => {
    const response = await request(app)
      .post(baseUrl + "/forgot")
      .send({ email: testUser.email });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Password reset code sent to your email");
  });

  test("Forgot password invalid email", async () => {
    const response = await request(app)
      .post(baseUrl + "/forgot")
      .send({ email: "notexist@none.com" });
    expect(response.statusCode).toBe(404);
  });
});
