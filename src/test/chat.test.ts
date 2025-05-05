import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import userModel, { IUser } from "../models/user_model";
import chatModel from "../chat/models/chat_model";

let app: Express;

const testUser: IUser & { token?: string; _id?: string } = {
  email: "chatuser@example.com",
  password: "testpassword",
  username: "chatuser",
  profilePicture: "https://example.com/pic.jpg"
};

beforeAll(async () => {
  app = await initApp();
  await userModel.deleteMany();
  await chatModel.deleteMany();

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

  testUser.token = res.body.accessToken;
  testUser._id = res.body._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Chat API", () => {
  let chatId: string;

  test("POST /chats - create chat", async () => {
    const response = await request(app)
      .post("/chats")
      .set("Authorization", `JWT ${testUser.token}`)
      .send({
        topic: "Pyramids of Giza",
        userId: testUser._id
      });

    expect(response.statusCode).toBe(201);
    expect(response.body._id).toBeDefined();
    expect(response.body.topic).toBe("Pyramids of Giza");
    chatId = response.body._id;
  });

  test("GET /chats/:id - get chat with messages", async () => {
    const response = await request(app)
      .get(`/chats/${chatId}`)
      .set("Authorization", `JWT ${testUser.token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(chatId);
    expect(response.body.messages).toBeDefined();
  });

  test("GET /chats/user/:userId - get chats by user", async () => {
    const response = await request(app)
      .get(`/chats/user/${testUser._id}`)
      .set("Authorization", `JWT ${testUser.token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].messages).toBeDefined();
  });

  test("DELETE /chats/:id - delete chat", async () => {
    const response = await request(app)
      .delete(`/chats/${chatId}`)
      .set("Authorization", `JWT ${testUser.token}`);

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Chat deleted");
  });

  test("GET /chats/:id - should fail after deletion", async () => {
    const response = await request(app)
      .get(`/chats/${chatId}`)
      .set("Authorization", `JWT ${testUser.token}`);

    expect(response.statusCode).toBe(404);
  });
});
