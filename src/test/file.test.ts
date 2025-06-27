import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import fs from "fs";
import path from "path";
import userModel, { IUser } from "../models/user_model";

var app: Express;
let accessToken: string = "";

const testUser: IUser = {
  username: "testuser",
  email: "testuser@example.com",
  password: "testpassword",
  profilePicture: "https://example.com/profile.jpg",
};

beforeAll(async () => {
  console.log("beforeAll - Setting up test environment");
  app = await initApp();

  await userModel.deleteMany();

  await request(app).post("/auth/register").send({
      name: testUser.username,
      email: testUser.email,
      password: testUser.password,
      profilePicture: testUser.profilePicture
    });
  
    const res = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: testUser.password
    });

  expect(res.statusCode).toBe(200);
  accessToken = res.body.accessToken;
  expect(accessToken).toBeDefined();
});

afterAll(async () => {
  console.log("afterAll - Closing database connection");
  await mongoose.connection.close();
});

describe("File Upload Tests", () => {
  test("Upload & Retrieve Image File (Authenticated)", async () => {
    const filePath = path.join(__dirname, "test_image.png");

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, ""); 
    }

    const uploadResponse = await request(app)
      .post("/file")
      .set("Authorization", "JWT " + accessToken) 
      .attach("file", filePath);

    expect(uploadResponse.statusCode).toBe(200);
    expect(uploadResponse.body.url).toBeDefined();

    let fileUrl = uploadResponse.body.url;
    console.log("Generated File URL:", fileUrl);

    fileUrl = new URL(fileUrl).pathname; 
    console.log("Formatted File URL for Test:", fileUrl);

    const fileResponse = await request(app).get(fileUrl);
    expect(fileResponse.statusCode).toBe(200);
  });

  test("Reject Non-Image File Upload (Authenticated)", async () => {
    const filePath = path.join(__dirname, "test_file.txt");

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "This is a test text file.");
    }

    const uploadResponse = await request(app)
      .post("/file")
      .set("Authorization", "JWT " + accessToken)
      .attach("file", filePath);

    expect(uploadResponse.statusCode).toBe(400);
    expect(uploadResponse.body.error).toBe("Only images (jpeg, png, gif, webp) are allowed.");
  });
});
test("Fail to upload when no file is attached", async () => {
  const response = await request(app)
    .post("/file")
    .set("Authorization", "JWT " + accessToken); // Valid token, no file

  expect(response.statusCode).toBe(400);
  expect(response.body.error).toBe("Only images (jpeg, png, gif, webp) are allowed.");
});

