const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("../api/user/userRoutes");
const photoPostRoutes = require("../api/photo/photoPostRoutes");
const photoPostCommentRoutes = require("../api/photo/photoPostCommentRoutes");
const communityRoutes = require("../api/community/communityRoutes");
const communityCommentRoutes = require("../api/community/communityCommentRoutes");
const ImageRoutes = require("../api/image/imageRoutes")
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

app.use("/", userRoutes);
app.use("/", photoPostRoutes);
app.use("/", photoPostCommentRoutes);
app.use("/", communityRoutes);
app.use("/", communityCommentRoutes);
app.use("/", ImageRoutes);

app.listen(port, () => {
  console.log(`程序運行於${ port }端口中`);
});
