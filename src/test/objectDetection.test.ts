import request from "supertest";
import initApp from "../server";
import { Express } from "express";
import path from "path";

var app: Express;

beforeAll(async () => {
  console.log("init app");
  app = await initApp();
});

afterAll((done) => {
  done();
});
const filePath = path.resolve(__dirname, 'IMG_8791.JPG');

describe("Image detection test", () => {
  it('should return 400 if no file is uploaded', async () => {
    const response = await request(app).post('/site-info/mock-data').send();
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('No file uploaded');
  });

  it('should return 200 with correct image information', async () => {
    const response = await request(app).post("/site-info/mock-data").attach("image",filePath);
    console.log(response.body); 

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Image uploaded successfully');
    expect(response.body.objects).toBeDefined();
    expect(response.body.objects[0].labels).toBe('paris');
    expect(response.body.objects[0].boundingBox).toEqual({
      x: 300,
      y: 200,
      width: 100,
      height: 200,
    });
    expect(response.body.objects[0].center).toEqual({
      x: 350,
      y: 300,
    });
  });
});
