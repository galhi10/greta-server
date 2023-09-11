import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import routes from "./routes";
import { config } from "./config";
import path from "path";
import "./services/mongoose";

const app = express();

const PORT = config.server.port || 3005;

app.use(cors());
app.use(bodyParser.json());
app.use(routes);

app.use("/", express.static(path.join(__dirname, "../../client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
});

app.listen(PORT, () => console.log(`App listening at port ${PORT}`));
