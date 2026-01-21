const mongoose = require('mongoose');
const workOrderSchema = new mongoose.Schema({
  asset: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  history: [{ 
    action: String, 
    timestamp: { type: Date, default: Date.now }, 
    details: String 
  }],
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('WorkOrder', workOrderSchema);