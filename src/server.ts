import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import authRoute from "./routes/auth_route";
import userRoute from "./routes/user_route";
import siteInfoRoute from './routes/siteInfo_route';
import reviewsRoute from './routes/reviews_route';
import siteInfoHistoryRoute from './routes/siteInfoHistory_route';
import chatRoute from './chat/routes/chat_route';
import placesRoute from './routes/places_route';
import userStatisticsRoute from "./routes/userStatistics_route";
import fileRoute from "./routes/file_route";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import bodyParser from "body-parser";

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));
app.use("/public", express.static("public"));
app.use('/site-info', siteInfoRoute);
app.use('/reviews', reviewsRoute);
app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/siteinfo_history", siteInfoHistoryRoute);
app.use("/chats", chatRoute);
app.use("/places", placesRoute);
app.use("/user_Statistics", userStatisticsRoute);
app.use("/file", fileRoute);  

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
  apis: ["./src/routes/*.ts" , "./src/chat/routes/*.ts"],
};
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

const initApp = () => {
  return new Promise<Express>((resolve, reject) => {
    if (!process.env.DB_CONNECT) {
      reject("DB_CONNECT is not defined in .env file");
    } else {
      mongoose
        .connect(process.env.DB_CONNECT as string)
        .then(() => {
          console.log("Connected to MongoDB");
          resolve(app);
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
};

export default initApp;