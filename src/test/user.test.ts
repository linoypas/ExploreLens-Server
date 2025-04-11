import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import userModel, { IUser } from "../models/user_model";
import { Express } from "express";

var app: Express;

type User = IUser & { token?: string; refreshToken?: string };
const testUser: User = {
  username: "testuser",
  email: "testuser@example.com",
  password: "testpassword",
  profilePicture: "https://example.com/profile.jpg",
};

const secondTestUser: User = {
  username: "testuser2",
  email: "testuser2@example.com",
  password: "testpassword",
  profilePicture: "https://example.com/profile2.jpg",
};

beforeAll(async () => {
  console.log("beforeAll - Setting up test environment");
  app = await initApp();
  await userModel.deleteMany();
});

afterAll((done) => {
  console.log("afterAll - Closing database connection");
  mongoose.connection.close();
  done();
});

describe("User Controller API Tests", () => {
  let userId: string;
  let secondUserId: string;

  test("Get all users (Initially empty)", async () => {
    const response = await request(app).get("/users");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBe(0);
  });

  test("Create a new user", async () => {
    await request(app).post("/auth/register").send(testUser);
    const res = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: testUser.password,
      username: testUser.username,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body._id).toBeDefined();
    testUser.token = res.body.accessToken;
    testUser._id = res.body._id;
    userId = res.body._id;
  });

  test("Create another user", async () => {
    await request(app).post("/auth/register").send(secondTestUser);
    const res = await request(app).post("/auth/login").send({
      email: secondTestUser.email,
      password: secondTestUser.password,
      username: secondTestUser.username,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body._id).toBeDefined();
    secondTestUser.token = res.body.accessToken;
    secondTestUser._id = res.body._id;
    secondUserId = res.body._id;
  });

  test("Get user by ID", async () => {
    const response = await request(app).get(`/users/${userId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe(testUser.username);
    expect(response.body.email).toBe(testUser.email);
  });

  test("Get user by username", async () => {
    const response = await request(app).get(`/users/username/${testUser.username}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe(testUser.username);
    expect(response.body.email).toBe(testUser.email);
  });

  test("Fail to get user by non-existing username", async () => {
    const response = await request(app).get(`/users/username/nonexistentuser`);
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe("User not found");
  });

  test("Update user details", async () => {
    const updatedUser = {
      username: "newUserName",
      profilePicture: "NewImage",
    };

    const response = await request(app)
      .put(`/users/${userId}`)
      .set({ authorization: `JWT ${testUser.token}` }) 
      .send(updatedUser);

    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe("newUserName");
    expect(response.body.profilePicture).toBe("NewImage");
  });

  test("Fail to update user with an existing username", async () => {
    const response = await request(app)
      .put(`/users/${userId}`)
      .set({ authorization: `JWT ${testUser.token}` }) 
      .send({ username: secondTestUser.username });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Username is already taken");
  });

  test("Fail to get user that does not exist", async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString();
    const response = await request(app).get(`/users/${nonExistentId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe("User not found");
  });

  test("Delete user", async () => {
    const response = await request(app)
      .delete(`/users/${userId}`)
      .set({ authorization: `JWT ${testUser.token}` });

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("deleted");

    const response2 = await request(app).get(`/users/${userId}`);
    expect(response2.statusCode).toBe(404);
    expect(response2.body.error).toBe("User not found");
  });

  test("Fail to delete user that does not exist", async () => {
    const response = await request(app)
      .delete(`/users/${new mongoose.Types.ObjectId()}`)
      .set({ authorization: `JWT ${testUser.token}` });

    expect(response.statusCode).toBe(404);
  });
});