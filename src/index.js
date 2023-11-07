const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("../api/user/userRoutes");
const photoPostRoutes = require("../api/photo/photoPostRoutes");
const photoPostCommentRoutes = require("../api/photo/photoPostCommentRoutes");
const communityRoutes = require("../api/community/communityRoutes");
const communityCommentRoutes = require("../api/community/communityCommentRoutes");
const ImageRoutes = require("../api/image/imageRoutes");
const visitor = require("../api/visitor")
require('dotenv').config();

const app = express();

const port = process.env.PORT || 3000;
const dbUrl = process.env.DBUrl;

(async () => {
  await mongoose.connect(dbUrl);
  return "DB連接成功!!!";
})()
  .then((solved) => console.log(solved))
  .catch((err) => console.log("錯誤發生 : ", err));

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", photoPostRoutes);
app.use("/api", photoPostCommentRoutes);
app.use("/api", communityRoutes);
app.use("/api", communityCommentRoutes);
app.use("/api", ImageRoutes);
app.use("/api", visitor);

app.listen(port, () => {
  console.log(`程序運行於${ port }端口中`);
});
