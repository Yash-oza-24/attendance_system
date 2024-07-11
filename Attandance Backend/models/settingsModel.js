const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  totalWorkingHours: { type: Number, required: true },
  totalDaysInMonth: { type: Number, required: true },
  standardWorkingHours: {
    start: { type: String, required: true }, // Example: '09:00:00'
    end: { type: String, required: true }    // Example: '17:00:00'
  }
});

const Setting = mongoose.model('Setting', settingSchema);
module.exports = Setting;
