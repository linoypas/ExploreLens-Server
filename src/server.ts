import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();
import siteInfoRoutes from './routes/siteInfo_route';

const app = express();
app.use(express.json());

app.use("/public", express.static("public"));
app.use('/site-info', siteInfoRoutes);

const initApp = () => {
  return new Promise<Express>((resolve) => {
    resolve(app);
  });
};

export default initApp;