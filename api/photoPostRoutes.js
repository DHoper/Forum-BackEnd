const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { PhotoPostSchema } = require("./schema.js");

const PhotoPost = mongoose.model("PhotoPost", PhotoPostSchema);

router.get("/photoPost", async (req, res) => {
  //取得貼文
  const photoPost = await PhotoPost.find({})
    .sort({ createdAt: -1 })
    .catch((err) => res.status(500).send("取得資料失敗:" + err));
  res.json(photoPost);
});

router.post("/photoPost", async (req, res) => {
  //創建貼文
  const postData = await req.body;
  const newPhotoPost = new PhotoPost(postData);
  const response = await newPhotoPost
    .save()
    .catch((err) => res.status(500).send("貼文建立失敗失敗:" + err));
  res.json("貼文發佈成功!");
});

router.get("/photoPost/:id", async (req, res) => {
  //取得單筆貼文
  const postId = req.params.id;
  const photoPost = await PhotoPost.findById(postId).catch((err) =>
    res.status(500).send("取得資料失敗")
  );
  res.json(photoPost);
});

router.post("/photoPost/:id/statistics/:action", async (req, res) => {
  //更新貼文統計數字
  const id = req.params.id;
  const action = req.params.action;

  if (action === "updateViews") {
    try {
      const updatedViews = await PhotoPost.findByIdAndUpdate(id, {
        $inc: { views: 1 },
      });
      res.json(updatedViews);
    } catch (error) {
      res.status(500).send("更新views失敗");
    }
  } else if (action === "increaseLikes") {
    try {
      const updatedViews = await PhotoPost.findByIdAndUpdate(id, {
        $inc: { likes: 1 },
      });

      res.json(updatedViews);
    } catch (error) {
      res.status(500).send("增加likes失敗");
    }
  } else if (action === "reduceLikes") {
    try {
      const updatedViews = await PhotoPost.findByIdAndUpdate(id, {
        $inc: { likes: -1 },
      });

      res.json(updatedViews);
    } catch (error) {
      res.status(500).send("減少likes失敗");
    }
  }
});

module.exports = router;
