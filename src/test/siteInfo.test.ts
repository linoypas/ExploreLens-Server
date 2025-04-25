import request from "supertest";
import mongoose from "mongoose";
import siteInfoModel from "../models/siteInfo_model"; 
import commentModel from "../models/comment_model";
import initApp from "../server";
import { Express } from "express";

var app: Express;

beforeAll(async () => {
    app = await initApp();
    await siteInfoModel.deleteMany();
    await commentModel.deleteMany();
});

afterAll(async () => {
    mongoose.connection.close();
});

describe("siteInfo API", () => {
  let sitename: string = "eiffel";
  let siteId: string;
  let commentId: string;

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

  it("POST /site-info/rating/:siteId - should update rating and comments", async () => {
    const res = await request(app)
      .post(`/site-info/rating/${siteId}`)
      .send({ 
        userId: '1111',
        rating:5 
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.averageRating).toBeGreaterThan(0);
  });
  it("POST /site-info/rating/:siteId - should update rating and comments", async () => {
    const res = await request(app)
      .post(`/site-info/rating/${siteId}`)
      .send({ 
        userId: '1112',
        rating: 1 });
    expect(res.statusCode).toBe(200);
    expect(res.body.averageRating).toBe(3);
  });
  it("POST /site-info/rating/:siteId - should update rating and comments", async () => {
    const res = await request(app)
      .post(`/site-info/rating/${siteId}`)
      .send({ 
        userId: '1112',
        rating: 5 });
    expect(res.statusCode).toBe(200);
    expect(res.body.averageRating).toBe(5);
  });
  it("POST /comments/:siteId - should add a comment to the siteInfo", async () => {
    const res = await request(app)
      .post(`/comments/${siteId}`)
      .send({ content: "Great place!", owner: "linoy" });
    expect(res.statusCode).toBe(201);
    expect(res.body.content).toBe("Great place!");
    expect(res.body.owner).toBe("linoy");
    commentId = res.body._id;
  });
  it("PUT /comments/:siteId/:commentId - should update the comment content", async () => {
    const updatedContent = "Updated comment!";
    const res = await request(app)
      .put(`/comments/${siteId}/${commentId}`)
      .send({ content: updatedContent });
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(commentId);
    expect(res.body.content).toBe(updatedContent);
  });
  it("GET /comments/:sitetId/:commentId' - should retrieve the comment by ID", async () => {
    const res = await request(app).get(`/comments/${siteId}/${commentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(commentId);
    expect(res.body.content).toBe("Updated comment!");
  });
  it("GET /site-info/:siteId - should contain the posted comment", async () => {
    const res = await request(app).get(`/site-info/${siteId}`);
    expect(res.statusCode).toBe(200);
    const comments = res.body.comments;
    expect(Array.isArray(comments)).toBe(true);
    const found = comments.includes(commentId);
    expect(found).toBe(true);
  });
  // it("DELETE /comments/:siteId/:commentId - should delete the comment by ID", async () => {
  //   const res = await request(app).delete(`/comments/${siteId}/${commentId}`);
  //   expect(res.statusCode).toBe(200);
  //   const deleted = await commentModel.findById(commentId);
  //   expect(deleted).toBeNull();
  // });
  // it("DELETE /site-info/:id - should delete the siteInfo", async () => {
  //   const res = await request(app).delete(`/site-info/${siteId}`);
  //   expect(res.statusCode).toBe(200);
  //   const check = await siteInfoModel.findById(siteId);
  //   expect(check).toBeNull();
  // });

  
});
