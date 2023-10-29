const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { PhotoPostSchema, CommentSchema } = require("./schema.js");

const PhotoPostComment = mongoose.model("PhotoPostComment", CommentSchema);
const PhotoPost = mongoose.model("PhotoPost", PhotoPostSchema);

router.get("/photoPostComment/:id", async (req, res) => {
  const id = req.params.id;
  const photoPostComment = await PhotoPostComment.findById(id).catch((err) =>
    res.status(500).send("取得photoPostComment資料失敗")
  );
  res.json(photoPostComment);
});

router.post("/photoPostComment/getComments", async (req, res) => {
  const idList = req.body.idList;
console.log(idList);
  if (!idList || !Array.isArray(idList)) {
    return res.status(400).send("無效的ID資料列");
  }

  try {
    const photoPostComments = await PhotoPostComment.find({
      _id: { $in: idList },
    });

    res.json(photoPostComments);
  } catch (error) {
    res.status(500).send("取得photoPostComments資料失敗");
  }
});

router.post("/photoPostComment", async (req, res) => {
  const postData = await req.body;
  const postId = req.body.postId;
  const newPhotoPostComment = new PhotoPostComment(postData);
  await newPhotoPostComment
    .save()
    .catch((err) => res.status(500).send("建立新photoPostComment失敗"));
    console.log(postId);
  await PhotoPost.findByIdAndUpdate(postId, {
    $push: { commentsId: newPhotoPostComment._id },
  }).catch((err) => console.err("更新貼文留言失敗:", err));
  res.json("留言建立成功!");
});

router.delete("/photoPostComment/:photoPostCommentId", async (req, res) => {
  const photoPostCommentId = req.params.photoPostCommentId;

  try {
    const photoPostComment = await PhotoPostComment.findById(
      photoPostCommentId
    );
    if (!photoPostComment) {
      return res.status(404).json({ message: "找不到該評論" });
    }

    const postId = photoPostComment.postId;

    await PhotoPostComment.findByIdAndRemove(photoPostCommentId);

    await PhotoPost.findByIdAndUpdate(postId, {
      $pull: { photoPostCommentsId: photoPostCommentId },
    });

    res.json({ message: "評論已成功删除" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "删除評論時發生錯誤" });
  }
});

module.exports = router;
