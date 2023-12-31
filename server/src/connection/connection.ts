import mongoose from "mongoose";
import { MyConnectOptions } from "../types/dbConnectionOptions";
import dotenv from "dotenv";
dotenv.config();

const mongooseConnect = process.env.MONGOOSE_CLUSTER_URL;

const dbOptions: MyConnectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

export const database = () => { 
  mongoose
    .connect(process.env.MONGOOSE_CLUSTER_URL as string , dbOptions)
    .then(() => {
      console.log("database connected successfully");
    })
    .catch((err) => console.info("database connection error :", err));
};
