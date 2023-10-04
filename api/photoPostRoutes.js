const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const PhotoPostSchema = new mongoose.Schema({
  title: String,
  likes: Number,
  views: Number,
  description: String,
  location: String,
  geometry: {
    type: Object,
    coordinates: [Number],
  },
  comment: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Comment",
  },
  image: [
    {
      url: String,
      filename: String,
      _id: mongoose.Schema.Types.ObjectId,
    },
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  postDate: {
    type: Date,
    default: Date.now,
  },
});

const PhotoPost = mongoose.model("PhotoPost", PhotoPostSchema);

router.get("/photoPost", async (req, res) => {
  const photoPost = await PhotoPost.find({})
    .catch((err) => res.status(500).send("取得資料失敗"));
  res.json(photoPost);
});

router.get("/photoPost/:id", async (req, res) => {
  const photoPostId = req.params.id;
  const photoPost = await PhotoPost.findById(photoPostId)
    .catch((err) => res.status(500).send("取得資料失敗"));
  res.json(photoPost);
});

module.exports = router;
