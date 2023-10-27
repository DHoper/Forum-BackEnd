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
    postId: {
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
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    selectedAvatarIndex: {
      type: Number,
      required: true,
    },
    selectedTags: {
      type: Array,
      required: true,
    },
    intro: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const CommunityPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    },
    content: {
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
    topicTags: {
      type: [
        {
          type: String,
        },
      ],
      required: true,
    },
    commentsId: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "communityComment",
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

module.exports = {
  PhotoPostSchema,
  UserSchema,
  CommentSchema,
  CommunityPostSchema,
};
