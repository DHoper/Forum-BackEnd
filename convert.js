const mongoose = require("mongoose");

function getRandomInt(min, max) {
  // 使用Math.random()生成0到1之間的隨機小數，將其乘以範圍差值，然後取整
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 连接到源数据库
const sourceDBURI =
  "mongodb+srv://dhoper777:apollo777@cluster0.jw3kqlu.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(sourceDBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 连接到目标数据库
const targetDBURI =
  "mongodb+srv://gxgemini777:apollo777@wildlens.0vgoc5r.mongodb.net/main?retryWrites=true&w=majority";
const targetConnection = mongoose.createConnection(targetDBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 定义源数据库的模型
const SourceModel = mongoose.model("Animal", {});

const schema = new mongoose.Schema({
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
    default: Date.now, // 可以指定默認日期值，如果未提供日期，將使用當前日期
  },
});

// 定义目标数据库的模型
const TargetModel = targetConnection.model("PhotoPost", schema);

// 查询源数据库的数据并返回 Promise
const querySourceData = async () => {
  const data = await SourceModel.find({}).lean();
  return data;
};

// 查询源数据库的数据
querySourceData()
  .then(async (data) => {
    // 将数据插入到目标数据库
    console.log(data);
    for (const item of data) {
      try {
        await TargetModel.create({
          title: item.title,
          likes: getRandomInt(1, 1000),
          views: getRandomInt(1, 1000),
          description: item.description,
          location: item.location,
          geometry: item.geometry,
          comment: item.reviews,
          image: item.image,
          author: data[0].author,
          postDate: item._id.getTimestamp(),
        });
        console.log("插入成功:", item);
      } catch (error) {
        console.error("插入失敗:", error);
      }
    }
    return TargetModel.insertMany(data);
  })
  .then(() => {
    console.log("数据复制成功！");
    // 关闭数据库连接
    mongoose.connection.close();
    targetConnection.close();
  })
  .catch((err) => {
    console.error("出错：", err);
    // 关闭数据库连接
    mongoose.connection.close();
    targetConnection.close();
  });
