const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { UserSchema }= require("./schema.js");

const User = mongoose.model("User", UserSchema);

router.get("/user", async (req, res) => {
  const users = await User.find({}).catch((err) =>
    res.status(500).send("取得資料失敗")
  );
  res.json(users);
});

router.get("/user/:email", async (req, res) => {
  const userEmail = req.params.email;
  const user = await User.findOne({ email: userEmail }).catch((err) =>
    res.status(500).send(`取得資料失敗,錯誤訊息:${err}`)
  );
  res.json(user);
});

router.get("/user/author/:authorID", async (req, res) => {
  const authorID = req.params.authorID;
  const user = await User.findById(authorID).catch((err) =>
    res.status(500).send(`取得資料失敗,錯誤訊息:${err}`)
  );
  res.json(user);
});

router.post("/user", async (req, res) => {
  const postData = await req.body;
  const newUser = new User(postData);
  await newUser.save();
  res.json("註冊成功!");
});

module.exports = router;
