import request from "supertest";
import mongoose from "mongoose";
import siteInfoModel from "../models/siteInfo_model"; 
import initApp from "../server";
import { Express } from "express";


var app: Express;

beforeAll(async () => {
    app = await initApp();
    await siteInfoModel.deleteMany();
});

afterAll(async () => {
    mongoose.connection.close();
});

describe("siteInfo API", () => {
  let sitename: string="eiffel";
  let siteId: string;

  it("GET /site-info/sitename/:sitename - should return existing siteInfo by name", async () => {
    const res = await request(app).get(`/site-info/sitename/${sitename}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(sitename);
    siteId = res.body._id;

  });

  it("GET /site-info - should retrieve all siteInfo entries", async () => {
    const res = await request(app).get("/site-info");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /site-info/:id - should retrieve siteInfo by ID", async () => {
    const res = await request(app).get(`/site-info/${siteId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(siteId);
  });

  

  it("PUT /site-info/:id - should update rating and comments", async () => {
    const res = await request(app)
      .put(`/site-info/${siteId}`)
      .send({ rating: 5, comments: {content:"Amazing!",user:"linoy"} });

    expect(res.statusCode).toBe(200);
    expect(res.body.averageRating).toBeGreaterThan(0);
    expect(Array.isArray(res.body.comments)).toBe(true);
  });

  it("DELETE /site-info/:id - should delete the siteInfo", async () => {
    const res = await request(app).delete(`/site-info/${siteId}`);
    expect(res.statusCode).toBe(200);

    const check = await siteInfoModel.findById(siteId);
    expect(check).toBeNull();
  });
});
