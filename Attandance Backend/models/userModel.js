const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    position: {
        type: String
    },
    branch: {
        type: String
    },
    address: {
        type: String
    },
    accessRights: [
        {
            type: String
        }
    ],
    accountStatus: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: String
    },
    role: {
        type: String,
        enum: ['admin', "branchAdmin", "employee"]
    },
    parentno: {
        type: String
    },
    salary: {
        type: Number,
        required: true
    },
    address: {
        type: String
    },
    currentMonthAttendance: [{
        date: {
            type: Date,
            required: true
        },
        checkInTime: {
            type: Date
        },
        checkOutTime: {
            type: Date
        },
        dailyWorkingHours: {
            type: Number
        },
        dailySalary: {
            type: Number
        },
        monthlySalary: {
            type: Number
        },
        reason: {
            type: String
        },
        lateTime: {
            type: String
        },
        overTime: {
            type: String
        }
    }],
});

module.exports = mongoose.model('User', userSchema);
