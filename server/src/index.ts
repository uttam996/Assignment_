import cors from "cors";
import express from "express";
import router from "./routes";
import morgen from "morgan";
import db from "./db";
import { Config } from "./config/config";

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgen("dev"));

app.use("/api/v1", router);

app.listen(Config.PORT, () => {
  console.log("Server is running on port 3000");
});
