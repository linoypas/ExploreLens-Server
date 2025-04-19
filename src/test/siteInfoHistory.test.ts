import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import userModel, { IUser } from "../models/user_model";
import siteInfoHistoryModel from "../models/siteinfo_history_model";

let app: Express;

const mockSiteId = new mongoose.Types.ObjectId().toString();
const mockGeoHash = "u4pruydqqvj";

const testUser: IUser & { token?: string; _id?: string } = {
  email: "historyuser@example.com",
  password: "testpassword",
  username: "historyuser",
  profilePicture: "https://example.com/pic.jpg"
};

beforeAll(async () => {
  app = await initApp();
  await userModel.deleteMany();
  await siteInfoHistoryModel.deleteMany();

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

describe("SiteInfoHistory API", () => {
  let itemId: string;

  test("POST /siteinfo_history - create entry", async () => {
    const response = await request(app)
      .post("/siteinfo_history")
      .set("Authorization", `JWT ${testUser.token}`)
      .send({
        siteInfoId: mockSiteId,
        geohash: mockGeoHash,
        userId: testUser._id
      });

    expect(response.statusCode).toBe(201);
    expect(response.body._id).toBeDefined();
    itemId = response.body._id;
  });

  test("GET /siteinfo_history - get all", async () => {
    const response = await request(app).get("/siteinfo_history");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /siteinfo_history/:id - get by id", async () => {
    const response = await request(app).get(`/siteinfo_history/${itemId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(itemId);
  });

  test("GET /siteinfo_history/user/:userId", async () => {
    const response = await request(app).get(`/siteinfo_history/user/${testUser._id}`);
    expect(response.statusCode).toBe(200);
  });

  test("GET /siteinfo_history/site/${mockSiteId}", async () => {
    const response = await request(app).get(`/siteinfo_history/site/${mockSiteId}`);
    expect(response.statusCode).toBe(200);
  });

  test("GET /siteinfo_history/daterange", async () => {
    const start = new Date(Date.now() - 1000 * 60 * 60).toISOString();
    const end = new Date(Date.now() + 1000 * 60 * 60).toISOString();

    const response = await request(app).get(`/siteinfo_history/daterange?start=${start}&end=${end}`);
    expect(response.statusCode).toBe(200);
  });

  test("GET /siteinfo_history/filter - get by user, site, date range", async () => {
    const start = new Date(Date.now() - 1000 * 60 * 60).toISOString();
    const end = new Date(Date.now() + 1000 * 60 * 60).toISOString();

    const response = await request(app).get(`/siteinfo_history/filter?userId=${testUser._id}&siteInfoId=${mockSiteId}&start=${start}&end=${end}`);
    expect(response.statusCode).toBe(200);
  });

  test("PUT /siteinfo_history/:id - update", async () => {
    const response = await request(app)
      .put(`/siteinfo_history/${itemId}`)
      .set("Authorization", `JWT ${testUser.token}`)
      .send({ geohash: "u4pruydqqvk" });

    expect(response.statusCode).toBe(200);
    expect(response.body.geohash).toBe("u4pruydqqvk");
  });

  test("DELETE /siteinfo_history/:id", async () => {
    const response = await request(app)
      .delete(`/siteinfo_history/${itemId}`)
      .set("Authorization", `JWT ${testUser.token}`);

    expect(response.statusCode).toBe(200);
  });
});
