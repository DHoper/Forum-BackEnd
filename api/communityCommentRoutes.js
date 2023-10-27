const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { CommunityPostSchema, CommentSchema } = require("./schema.js");

const CommunityComment = mongoose.model("CommunityComment", CommentSchema);
const CommunityPost = mongoose.model("CommunityPost", CommunityPostSchema);

router.get("/communityComment/:id", async (req, res) => {
  const id = req.params.id;
  const communityComment = await CommunityComment.findById(id).catch((err) =>
    res.status(500).send("取得communityComment資料失敗")
  );
  res.json(communityComment);
});

router.post("/communityComment/getComments", async (req, res) => {
  const idList = req.body.idList;
console.log(idList);
  if (!idList || !Array.isArray(idList)) {
    return res.status(400).send("無效的ID資料列");
  }

  try {
    const communityComments = await CommunityComment.find({
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
  const newCommunityComment = new CommunityComment(postData);
  await newCommunityComment
    .save()
    .catch((err) => res.status(500).send("建立新communityComment失敗"));
    console.log(postId);
  await CommunityPost.findByIdAndUpdate(postId, {
    $push: { commentsId: newCommunityComment._id },
  }).catch((err) => console.err("更新貼文留言失敗:", err));
  res.json("留言建立成功!");
});

router.delete("/communityComment/:communityCommentId", async (req, res) => {
  const communityCommentId = req.params.communityCommentId;

  try {
    const communityComment = await CommunityComment.findById(
      communityCommentId
    );
    if (!communityComment) {
      return res.status(404).json({ message: "找不到該評論" });
    }

    const postId = communityComment.postId;

    await CommunityComment.findByIdAndRemove(communityCommentId);

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
