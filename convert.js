const mongoose = require("mongoose");
const { PhotoPostSchema } = require("./api/schema.js")

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 來源資料庫
const sourceDBURI =
  "mongodb+srv://dhoper777:apollo777@cluster0.jw3kqlu.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(sourceDBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 目標資料庫
const targetDBURI =
  "mongodb+srv://gxgemini777:apollo777@wildlens.0vgoc5r.mongodb.net/main?retryWrites=true&w=majority";
const targetConnection = mongoose.createConnection(targetDBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 來源資料庫模型
const SourceModel = mongoose.model("Animal", {});


// 目標資料庫模型
const TargetModel = targetConnection.model("PhotoPost", PhotoPostSchema);

const querySourceData = async () => {
  const data = await SourceModel.find({}).lean();
  return data;
};

querySourceData()
  .then(async (data) => {
    await TargetModel.deleteMany({})
      .then((solve) => console.log(solve))
      .catch((err) => console.log(err));
    for (const item of data) {
      console.log(item.image);
      try {
        const insertData = {
          title: item.title,
          likes: getRandomInt(2, 20000),
          views: getRandomInt(2, 30000),
          description: item.description,
          location: item.location,
          geometry: item.geometry,
          commentsId: [],
          image: item.image,
          authorId: "651fb7cf5463fe57f2ac71bb",
          isEdit: false,
        };
        console.log(insertData);
        await TargetModel.create(insertData);
      } catch (error) {
        console.error("插入失敗:", error);
      }
    }
    return;
  })
  .then(() => {
    console.log("轉入成功！");
    mongoose.connection.close();
    targetConnection.close();
  })
  .catch((err) => {
    console.error("錯誤：", err);
    mongoose.connection.close();
    targetConnection.close();
  });
