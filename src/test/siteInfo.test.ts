import request from "supertest";
import mongoose from "mongoose";
import siteInfoModel from "../models/siteInfo_model"; 
import reviewModel from "../models/review_model";
import initApp from "../server";
import { Express } from "express";

var app: Express;

beforeAll(async () => {
    app = await initApp();
    await siteInfoModel.deleteMany();
    await reviewModel.deleteMany();
});

afterAll(async () => {
    mongoose.connection.close();
});

describe("siteInfo API", () => {
  let sitename: string = "eiffel";
  let siteId: string;
  let reviewId: string;

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
    expect(res.body.length).toBe(1);
  });

  it("GET /site-info/:id - should retrieve siteInfo by ID", async () => {
    const res = await request(app).get(`/site-info/${siteId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(siteId);
  });

  it("POST /site-info/rating/:siteId - should update rating and reviews", async () => {
    const res = await request(app)
      .post(`/site-info/rating/${siteId}`)
      .send({ 
        userId: '1111',
        rating:5 
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.averageRating).toBeGreaterThan(0);
  });
  it("POST /site-info/rating/:siteId - should update rating and reviews", async () => {
    const res = await request(app)
      .post(`/site-info/rating/${siteId}`)
      .send({ 
        userId: '1112',
        rating: 1 });
    expect(res.statusCode).toBe(200);
    expect(res.body.averageRating).toBe(3);
  });
  it("POST /site-info/rating/:siteId - should update rating and reviews", async () => {
    const res = await request(app)
      .post(`/site-info/rating/${siteId}`)
      .send({ 
        userId: '1112',
        rating: 5 });
    expect(res.statusCode).toBe(200);
    expect(res.body.averageRating).toBe(5);
  });
  it("POST /reviews/:siteId - should add a review to the siteInfo", async () => {
    const res = await request(app)
      .post(`/reviews/${siteId}`)
      .send({ content: "Great place!", userId: "linoy" });
    expect(res.statusCode).toBe(201);
    expect(res.body.content).toBe("Great place!");
    expect(res.body.userId).toBe("linoy");
    reviewId = res.body._id;
  });
  it("PUT /reviews/:siteId/:reviewId - should update the review content", async () => {
    const updatedContent = "Updated review!";
    const res = await request(app)
      .put(`/reviews/${siteId}/${reviewId}`)
      .send({ content: updatedContent });
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(reviewId);
    expect(res.body.content).toBe(updatedContent);
  });
  it("GET /reviews/:sitetId/:reviewId' - should retrieve the review by ID", async () => {
    const res = await request(app).get(`/reviews/${siteId}/${reviewId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(reviewId);
    expect(res.body.content).toBe("Updated review!");
  });
  it("GET /site-info/:siteId - should contain the posted review", async () => {
    const res = await request(app).get(`/site-info/${siteId}`);
    expect(res.statusCode).toBe(200);
    const reviews = res.body.reviews;
    expect(Array.isArray(reviews)).toBe(true);
    const found = reviews.includes(reviewId);
    expect(found).toBe(true);
  });
  it("DELETE /reviews/:siteId/:reviewId - should delete the review by ID", async () => {
    const res = await request(app).delete(`/reviews/${siteId}/${reviewId}`);
    expect(res.statusCode).toBe(200);
    const deleted = await reviewModel.findById(reviewId);
    expect(deleted).toBeNull();
  });
  it("DELETE /site-info/:siteId - should delete the siteInfo", async () => {
    console.log(siteId)
    const res = await request(app).delete(`/site-info/${siteId}`);
    expect(res.statusCode).toBe(200);
    const check = await siteInfoModel.findById(siteId);
    expect(check).toBeNull();
  });

  
});
