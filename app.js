const express = require("express");
const serverConfig = require("./config");
const admin = require("./manage/admin");
const cors = require("cors");

const app = express();
const port = serverConfig.server.port;
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(require("./routes"));

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
  admin.createAdmin().catch((err) => {
    console.log(err);
  });
});
