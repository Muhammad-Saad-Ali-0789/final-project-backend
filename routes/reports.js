const express = require('express');
const Asset = require('../models/Asset');
const WorkOrder = require('../models/WorkOrder');
const { auth, adminOnly } = require('../middleware/auth');
const router = express.Router();
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const totalAssets = await Asset.countDocuments();
    const totalTasks = await WorkOrder.countDocuments();
    const pendingTasks = await WorkOrder.countDocuments({ status: 'Pending' });
    const completedTasks = await WorkOrder.countDocuments({ status: 'Completed' });
    res.json({ totalAssets, totalTasks, pendingTasks, completedTasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;