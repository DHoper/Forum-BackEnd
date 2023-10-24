const mongoose = require("mongoose");

const PhotoPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    geometry: {
      type: Object,
      coordinates: [Number],
      required: true,
    },
    commentsId: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Comment",
    },
    images: {
      type: [
        {
          url: {
            type: String,
            required: true,
          },
          filename: {
            type: String,
            required: true,
          },
        },
      ],
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isEdit: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CommentSchema = new mongoose.Schema(
  {
    photoPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PhotoPost",
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserSchema = new mongoose.Schema(
  {
    email: String,
    username: String,
    password: String,
    selectedAvatarIndex: Number,
    selectedTags: Array,
    intro: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  PhotoPostSchema,
  UserSchema,
  CommentSchema,
};
