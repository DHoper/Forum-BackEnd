const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();


const Visitor = mongoose.model('Visitor', { count: Number });

router.post('/api/visitorCount', async (req, res) => {
  try {
    const updatedVisitor = await Visitor.findOneAndUpdate({}, { $inc: { count: 1 } }, { new: true, upsert: true });
    res.json({ visitorCount: updatedVisitor.count });
    console.log(`訪客+1，目前記數為:${updatedVisitor.count }位`);
  } catch (error) {
    console.error('訪客記數時發生錯誤：', error);
    res.status(500).json({ error: '訪客記數時發生錯誤' });
  }
});


module.exports = router;
