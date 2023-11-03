const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary");
const multer = require("multer");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new multer.memoryStorage();
const upload = multer({ storage });

async function handleUpload(file, dir) {
    const uploadOptions = {
      folder: dir,
      allowed_formats: ['jpeg', 'png', 'jpg', 'heic'],
      transformation: [
        { width: 400, height: 300, gravity: "auto", crop: "fill" },
      ],
      format: 'jpg',
      resource_type: "auto",
    };
  
    const res = await cloudinary.v2.uploader.upload(file, uploadOptions);
    return res;
  }

router.post("/image/:dir", upload.array("image"), async (req, res) => {
  const dir = req.params.dir;
  try {
    const responseData = [];

    for (const file of req.files) {
      const b64 = Buffer.from(file.buffer).toString("base64");
      let dataURI = "data:" + file.mimetype + ";base64," + b64;
      const cldRes = await handleUpload(dataURI, dir);

      responseData.push({
        url: cldRes.url,
        filename: cldRes.public_id,
      });
    }

    res.json(responseData);
  } catch (error) {
    res.send({
      message: error.message,
    });
  }
});

router.delete("/image", (req, res) => {
  const publicId = req.body;
  try {
    cloudinary.api.delete_resources(publicId, (error, result) => {
      console.log("圖片刪除成功:", publicId);
      res.json({ message: "圖片刪除成功" });
    });
  } catch (error) {
    console.error("圖片刪除失敗:", error);
    res.status(500).json({ message: "圖片刪除失敗" });
  }
});

module.exports = router;
