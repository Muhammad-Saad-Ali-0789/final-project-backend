const express = require('express');
const WorkOrder = require('../models/WorkOrder');
const { auth, managerOrAdmin } = require('../middleware/auth');
const router = express.Router();
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'Technician') query.assignedTo = req.user._id;
    const orders = await WorkOrder.find(query).populate('assignedTo', 'name');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/', auth, managerOrAdmin, async (req, res) => {
  try {
    const order = new WorkOrder(req.body);
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.put('/:id/assign', auth, managerOrAdmin, async (req, res) => {
  try {
    const order = await WorkOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Work order not found' });
    order.assignedTo = req.body.technicianId;
    order.history.push({ action: 'Assigned', details: `Assigned to technician ID: ${req.body.technicianId}` });
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await WorkOrder.findById(req.params.id).populate('assignedTo', 'name');
    if (!order) return res.status(404).json({ message: 'Work order not found' });
    if (req.user.role === 'Technician' && order.assignedTo?._id.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id/status', auth, async (req, res) => {
  try {
    const order = await WorkOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Work order not found' });
    if (req.user.role === 'Technician' && order.assignedTo.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Can only update assigned tasks' });
    }
    const oldStatus = order.status;
    order.status = req.body.status;
    order.history.push({ action: 'Status Update', details: `Status changed from ${oldStatus} to ${req.body.status}` });
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, managerOrAdmin, async (req, res) => {
  try {
    const order = await WorkOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Work order not found' });
    await WorkOrder.findByIdAndDelete(req.params.id);
    res.json({ message: 'Work order deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;