import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import routes from "./routes";
import { config } from "./config";
import "./services/mongoose";
import weatherApi from "./services/weatherApi";

const app = express();

const PORT = config.server.port || 3005;

app.use(cors());
app.use(bodyParser.json());
app.use(routes);

app.listen(PORT, () => console.log(`App listening at port ${PORT}`));


