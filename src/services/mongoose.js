// DB Connection
import mongoose from "mongoose";
import { config } from "../config";

mongoose
  .connect(config.db.uri, {})
  .then(async (r) => {
    console.log("Successfully connected to DB!");
  })
  .catch((err) => {
    console.log(err);
  });
mongoose.set("debug", false); // on true -> print to terminal db operations
