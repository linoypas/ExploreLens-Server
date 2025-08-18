import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import userModel, { IUser } from "../models/user_model";
import PasswordResetModel from "../models/passwordReset_model";

var app: Express;

const testUser: IUser = {
  username: "testuser",
  email: "testuser@example.com",
  password: "testpassword",
  profilePicture: "https://example.com/profile.jpg",
};

beforeAll(async () => {
  console.log("beforeAll - Setting up test environment");
  app = await initApp();

  // Clean up test data
  await userModel.deleteMany();
  await PasswordResetModel.deleteMany();
});

afterAll(async () => {
  console.log("afterAll - Closing database connection");
  await mongoose.connection.close();
});

describe("Password Reset Flow", () => {
  beforeEach(async () => {
    // Clean up before each test
    await userModel.deleteMany();
    await PasswordResetModel.deleteMany();
  });

  test("should register a user and then test forgot password flow", async () => {
    // First register a user
    const registerResponse = await request(app)
      .post("/auth/register")
      .send({
        name: testUser.username,
        email: testUser.email,
        password: testUser.password,
        profilePicture: testUser.profilePicture,
      });

    expect(registerResponse.statusCode).toBe(200);
    expect(registerResponse.body._id).toBeDefined();

    // Test forgot password
    const forgotResponse = await request(app)
      .post("/auth/forgot")
      .send({
        email: testUser.email,
      });

    expect(forgotResponse.statusCode).toBe(200);
    expect(forgotResponse.body.message).toBe("Password reset code sent to your email");

    // Check that reset code was saved in database
    const resetRecord = await PasswordResetModel.findOne({ email: testUser.email });
    expect(resetRecord).toBeDefined();
    expect(resetRecord?.code).toHaveLength(6);
    expect(resetRecord?.isUsed).toBe(false);
    expect(resetRecord?.expiresAt).toBeInstanceOf(Date);
  });

  test("should fail forgot password for non-existent user", async () => {
    const forgotResponse = await request(app)
      .post("/auth/forgot")
      .send({
        email: "nonexistent@example.com",
      });

    expect(forgotResponse.statusCode).toBe(404);
    expect(forgotResponse.body.message).toBe("User not found");
  });

  test("should fail reset password with invalid code", async () => {
    // First register a user
    await request(app)
      .post("/auth/register")
      .send({
        name: testUser.username,
        email: testUser.email,
        password: testUser.password,
        profilePicture: testUser.profilePicture,
      });

    // Try to reset password with invalid code
    const resetResponse = await request(app)
      .post("/auth/reset")
      .send({
        email: testUser.email,
        code: "123456",
        newPassword: "newpassword123",
      });

    expect(resetResponse.statusCode).toBe(400);
    expect(resetResponse.body.message).toBe("Invalid or expired reset code");
  });

  test("should fail reset password with missing fields", async () => {
    const resetResponse = await request(app)
      .post("/auth/reset")
      .send({
        email: testUser.email,
        // Missing code and newPassword
      });

    expect(resetResponse.statusCode).toBe(400);
    expect(resetResponse.body.message).toBe("Missing required fields: email, code, newPassword");
  });
});
