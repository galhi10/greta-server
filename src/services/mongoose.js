// DB Connection
import mongoose from "mongoose";
import { config } from "../config";

console.log(config.db.uri, "haha");
mongoose
  .connect(
    "mongodb+srv://ItamarKfir:1234@itamarkfir.d1awrao.mongodb.net/greta",
    {}
  )
  .then(async (r) => {
    console.log("Successfully connected to DB!");
  })
  .catch((err) => {
    console.log(err);
  });
mongoose.set("debug", false); // on true -> print to terminal db operations
