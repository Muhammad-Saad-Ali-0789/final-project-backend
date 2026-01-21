const mongoose = require('mongoose');
const assetSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  status: { type: String, enum: ['Operational', 'Under Maintenance', 'Out of Service'], default: 'Operational' },
  lastMaintenance: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Asset', assetSchema);