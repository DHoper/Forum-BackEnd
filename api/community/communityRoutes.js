const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { CommunityPostSchema, CommentSchema } = require("../schema.js");

const CommunityPost = mongoose.model("CommunityPost", CommunityPostSchema);
const CommunityPostComment = mongoose.model(
  "CommunityPostComment",
  CommentSchema
);

router.get("/communityPost", async (req, res) => {
  //取得所有貼文
  const communityPost = await CommunityPost.find({})
    .sort({ createdAt: -1 })
    .catch((err) => res.status(500).send("取得資料失敗:" + err));
  res.json(communityPost);
});

router.get("/communityPost/user/:authorId", async (req, res) => {
  //取得特定用戶的所有貼文
  const authorId = req.params.authorId;
  const communityPosts = await CommunityPost.find({ authorId })
    .sort({ createdAt: -1 })
    .catch((err) => res.status(500).send("取得資料失敗:" + err));

  res.json(communityPosts);
});

router.get("/communityPost/:id", async (req, res) => {
  //取得單筆貼文
  const communityPostId = req.params.id;
  const communityPost = await CommunityPost.findById(communityPostId).catch(
    (err) => res.status(500).send("取得資料失敗")
  );
  res.json(communityPost);
});

router.post("/communityPost", async (req, res) => {
  try {
    const postData = req.body;
    const newCommunityPost = new CommunityPost(postData);
    const response = await newCommunityPost.save();
    res.json("貼文發佈成功!");
  } catch (err) {
    res.status(500).send("貼文建立失敗: " + err);
  }
});

router.get("/communityPost/:id", async (req, res) => {
  //取得單筆貼文
  const communityPostId = req.params.id;
  const communityPost = await CommunityPost.findById(communityPostId).catch(
    (err) => res.status(500).send("取得資料失敗")
  );
  res.json(communityPost);
});

router.post("/communityPost/:id/statistics/:action", async (req, res) => {
  //更新貼文統計數字
  const id = req.params.id;
  const action = req.params.action;

  if (action === "updateViews") {
    try {
      console.log(id, action);
      const updatedViews = await CommunityPost.findByIdAndUpdate(id, {
        $inc: { views: 1 },
      });
      res.json(updatedViews);
    } catch (error) {
      res.status(500).send("更新views失敗");
    }
  } else if (action === "increaseLikes") {
    try {
      const updatedViews = await CommunityPost.findByIdAndUpdate(id, {
        $inc: { likes: 1 },
      });

      res.json(updatedViews);
    } catch (error) {
      res.status(500).send("增加likes失敗");
    }
  } else if (action === "reduceLikes") {
    try {
      const updatedViews = await CommunityPost.findByIdAndUpdate(id, {
        $inc: { likes: -1 },
      });

      res.json(updatedViews);
    } catch (error) {
      res.status(500).send("減少likes失敗");
    }
  }
});

router.put("/communityPost/:postId", async (req, res) => {
  //編輯&更新貼文
  try {
    const postId = req.params.postId;
    const updatedData = req.body;

    const updatedPost = await CommunityPost.findByIdAndUpdate(
      postId,
      updatedData,
      {
        new: true,
      }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "找不到該貼文" });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error("貼文修改失敗:", error);
    res.status(500).json({ error: "貼文修改失敗" });
  }
});

router.delete("/communityPost/:id", async (req, res) => {
  //刪除貼文
  const postId = req.params.id;
  try {
    const deletedCommunityPost = await CommunityPost.findByIdAndDelete(postId);
    const deletedPostComments = deletedCommunityPost.commentsId;
    for (const id of deletedPostComments) {
      await CommunityPostComment.findByIdAndRemove(id);
    }

    if (deletedCommunityPost) {
      res.json({ message: "貼文已成功删除", deletedCommunityPost });
    } else {
      res.status(404).json({ message: "未找到要删除的貼文" });
    }
  } catch (error) {
    res.status(500).json({ message: `刪除貼文失敗:${err}` });
  }
});

module.exports = router;
