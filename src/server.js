const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const photoPostRoutes = require("../api/photoPostRoutes");
const userRoutes = require("../api/userRoutes");
const commentRoutes = require("../api/photoPostCommentRoutes");
const communityRoutes = require("../api/communityRoutes");
const communityCommentRoutes = require("../api/communityCommentRoutes");

const app = express();
const dbUrl =
  "mongodb+srv://gxgemini777:apollo777@wildlens.0vgoc5r.mongodb.net/main?retryWrites=true&w=majority";

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
app.use("/", commentRoutes);
app.use("/", communityRoutes);
app.use("/", communityCommentRoutes);


app.listen(3000, () => {
  console.log("程序運行於 3000 端口中");
});
