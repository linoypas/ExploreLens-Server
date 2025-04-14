import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();
import siteInfoRoutes from './routes/siteInfo_route';
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import mongoose from 'mongoose'

const app = express();
app.use(express.json());

app.use("/public", express.static("public"));
app.use('/site-info', siteInfoRoutes);

const PORT = process.env.PORT || 3000;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Web Application",
      version: "1.0.0",
      description: "REST server including authentication using JWT",
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: ["./src/routes/*.ts"],
};
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

const initApp = () => {
  return new Promise<Express>((resolve, reject) => {
    if (!process.env.DB_CONNECT) {
      reject("DB_CONNECT is not defined in .env file");
    } else {
      mongoose
        .connect(process.env.DB_CONNECT)
        .then(() => {
          resolve(app);
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
};

export default initApp;