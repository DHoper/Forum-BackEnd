const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { CommunityPostSchema, CommentSchema } = require("../schema.js");

const CommunityPostComment = mongoose.model("CommunityPostComment", CommentSchema);
const CommunityPost = mongoose.model("CommunityPost", CommunityPostSchema);

router.get("/communityComment/:id", async (req, res) => {
  const id = req.params.id;
  const communityComment = await CommunityPostComment.findById(id).catch((err) =>
    res.status(500).send("取得communityComment資料失敗")
  );
  res.json(communityComment);
});

router.post("/communityComment/getComments", async (req, res) => {
  const idList = req.body;
  if (!idList || !Array.isArray(idList)) {
    return res.status(400).send("無效的ID資料列");
  }

  try {
    const communityComments = await CommunityPostComment.find({
      _id: { $in: idList },
    });

    res.json(communityComments);
  } catch (error) {
    res.status(500).send("取得communityComments資料失敗");
  }
});

router.post("/communityComment", async (req, res) => {
  const postData = await req.body;
  const postId = req.body.postId;
  const newCommunityPostComment = new CommunityPostComment(postData);
  await newCommunityPostComment
    .save()
    .catch((err) => res.status(500).send("建立新communityComment失敗"));
  await CommunityPost.findByIdAndUpdate(postId, {
    $push: { commentsId: newCommunityPostComment._id },
  }).catch((err) => console.err("更新貼文留言失敗:", err));
  res.json("留言建立成功!");
});

router.delete("/communityComment/:communityCommentId", async (req, res) => {
  const communityCommentId = req.params.communityCommentId;

  try {
    const communityComment = await CommunityPostComment.findById(
      communityCommentId
    );
    if (!communityComment) {
      return res.status(404).json({ message: "找不到該評論" });
    }

    const postId = communityComment.postId;

    await CommunityPostComment.findByIdAndRemove(communityCommentId);

    await CommunityPost.findByIdAndUpdate(postId, {
      $pull: { communityCommentsId: communityCommentId },
    });

    res.json({ message: "評論已成功删除" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "删除評論時發生錯誤" });
  }
});

module.exports = router;
