import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

app.use("/public", express.static("public"));

const initApp = () => {
  return new Promise<Express>((resolve) => {
    resolve(app);
  });
};

export default initApp;