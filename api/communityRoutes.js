const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { CommunityPostSchema } = require("./schema.js");

const CommunityPost = mongoose.model("CommunityPost", CommunityPostSchema);

router.get("/communityPost", async (req, res) => {
  //取得所有貼文
  const communityPost = await CommunityPost.find({})
    .sort({ createdAt: -1 })
    .catch((err) => res.status(500).send("取得資料失敗:" + err));
  res.json(communityPost);
});

router.post("/communityPost", async (req, res) => {
  //創建貼文
  const postData = await req.body;
  const newCommunityPost = new CommunityPost(postData);
  const response = await newCommunityPost
    .save()
    .catch((err) => res.status(500).send("貼文建立失敗失敗:" + err));
  res.json("貼文發佈成功!");
});

router.get("/communityPost/:id", async (req, res) => {
  //取得單筆貼文
  const communityPostId = req.params.id;
  const communityPost = await CommunityPost.findById(communityPostId).catch((err) =>
    res.status(500).send("取得資料失敗")
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

module.exports = router;
