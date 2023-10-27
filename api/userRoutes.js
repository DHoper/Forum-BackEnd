const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { UserSchema } = require("./schema.js");

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
  const authorData = {
    username: user.username,
    selectedAvatarIndex: user.selectedAvatarIndex,
  }
  res.json(authorData);
});

router.post("/user", async (req, res) => {
  const postData = await req.body;
  const newUser = new User(postData);
  await newUser.save();
  res.json("註冊成功!");
});

router.put("/user", async (req, res) => {
  const updatedData = req.body;
  const userId = updatedData._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "用户不存在" });
    }
    user.set({
      ...updatedData,
      _id: user._id,
    });

    await user.save();

    res.json({ message: "用戶資料已更新", user: user });
  } catch (err) {
    res.status(500).json({ message: `更新用戶資料失敗: ${err}` });
  }
});
module.exports = router;
