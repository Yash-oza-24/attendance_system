const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    // employeeId: { 
    //     type: mongoose.Schema.Types.ObjectId, 
    //     ref: 'User', 
    //     required: true 
    // },
    employeeName : {
        type: String,
        required : true
    }, 
    employeeMobileno : {
        type: Number,
        required : true
    }, 
    startDate: { 
        type: Date, 
        required: true 
    },
    endDate: { 
        type: Date, 
        required: true 
    },
    reason: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Rejected'], 
        default: 'Pending' 
    },
    leaveType: { 
        type: String, 
        enum: ['Vacation', 'Sick', 'Personal', 'Other'], 
        required: true 
    },
    shift : {
        type: String,
        enum: ['First Shift' , "Second Shift" , "Full Day"],
        required: true
    },
    comments: { 
        type: String 
    },
    leaveDays: { 
        type: Number 
    },
    branch:{
        type: String
    }
}, {
    timestamps: true
});

// Calculate leave duration
leaveSchema.methods.calculateLeaveDuration = function () {
    const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
    return Math.round(Math.abs((this.endDate - this.startDate) / oneDay)) + 1;
};

// Pre-save hook to calculate leave days
leaveSchema.pre('save', function (next) {
    this.leaveDays = this.calculateLeaveDuration();
    next();
});

module.exports = mongoose.model('Leave', leaveSchema);
