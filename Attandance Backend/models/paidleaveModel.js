const mongoose = require('mongoose');

const paidLeaveSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true 
    },
    reason: {
        type: String,
        required: true
    },
    isPaid: {
        type: String,
        required: true,
        enum: ['paid', 'unpaid']
    }
});

module.exports = mongoose.model('PaidLeave', paidLeaveSchema);
