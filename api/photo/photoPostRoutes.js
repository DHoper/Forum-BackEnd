const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { PhotoPostSchema, CommentSchema } = require("../schema.js");

const PhotoPost = mongoose.model("PhotoPost", PhotoPostSchema);
const PhotoPostComment = mongoose.model("PhotoPostComment", CommentSchema);

router.get("/photoPost", async (req, res) => {
  //取得所有貼文
  const photoPost = await PhotoPost.find({})
    .sort({ createdAt: -1 })
    .catch((err) => res.status(500).send("取得資料失敗:" + err));
  res.json(photoPost);
});

router.get("/photoPost/user/:authorId", async (req, res) => {
  //取得特定用戶的所有貼文
  const authorId = req.params.authorId;
  const photoPosts = await PhotoPost.find({ authorId })
    .sort({ createdAt: -1 })
    .catch((err) => res.status(500).send("取得資料失敗:" + err));
  res.json(photoPosts);
});

router.get("/photoPost/:id", async (req, res) => {
  //取得單筆貼文
  const postId = req.params.id;
  const photoPost = await PhotoPost.findById(postId).catch((err) =>
    res.status(500).send("取得資料失敗")
  );
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

router.put("/photoPost/:postId", async (req, res) => {
  //編輯&更新貼文
  try {
    const postId = req.params.postId;
    const updatedData = req.body;

    const updatedPost = await PhotoPost.findByIdAndUpdate(postId, updatedData, {
      new: true,
    });

    if (!updatedPost) {
      return res.status(404).json({ error: "找不到該貼文" });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error("貼文修改失敗:", error);
    res.status(500).json({ error: "貼文修改失敗" });
  }
});

router.delete("/photoPost/:id", async (req, res) => {
  //刪除貼文
  const postId = req.params.id;
  try {
    const deletedPhotoPost = await PhotoPost.findByIdAndDelete(postId);
    const deletedPostComments = deletedPhotoPost.commentsId;
    for(const id of deletedPostComments) {
      await PhotoPostComment.findByIdAndRemove(id);
    }

    if (deletedPhotoPost) {
      res.json({ message: "貼文已成功删除", deletedPhotoPost });
    } else {
      res.status(404).json({ message: "未找到要删除的貼文" });
    }
  } catch (error) {
    res.status(500).json({ message: `刪除貼文失敗:${err}` });
  }
});

module.exports = router;
