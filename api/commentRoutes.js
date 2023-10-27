const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { PhotoPostSchema, CommentSchema } = require("./schema.js");

const Comment = mongoose.model("Comment", CommentSchema);
const PhotoPost = mongoose.model("PhotoPost", PhotoPostSchema);

router.get("/comment/:id", async (req, res) => {
  const id = req.params.id;
  const comment = await Comment.findById(id).catch((err) =>
    res.status(500).send("取得comment資料失敗")
  );
  res.json(comment);
});

router.post("/comment", async (req, res) => {
  const postData = await req.body;
  const postId = req.body.postId;
  const newComment = new Comment(postData);
  await newComment
    .save()
    .catch((err) => res.status(500).send("建立新comment失敗"));
  await PhotoPost.findByIdAndUpdate(postId, {
    $push: { commentsId: newComment._id },
  });
  res.json("留言建立成功!");
});

router.delete("/comment/:commentId", async (req, res) => {
  const commentId = req.params.commentId;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "找不到該評論" });
    }

    const postId = comment.postId;

    await Comment.findByIdAndRemove(commentId);

    await PhotoPost.findByIdAndUpdate(postId, {
      $pull: { commentsId: commentId },
    });

    res.json({ message: "評論已成功删除" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "删除評論時發生錯誤" });
  }
});

module.exports = router;
