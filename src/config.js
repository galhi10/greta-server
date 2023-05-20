import * as dotenv from "dotenv";
dotenv.config();

export const config = {
  jwt: {
    secret: process.env.JWT_SECRET,
    exp: "24h",
  },
  server: {
    port: 2718,
  },
  db: { uri: process.env.MONGO_URI },
  weather: { api_key: process.env.WEATHER_API_KEY }
};
