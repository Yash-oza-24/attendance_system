// controllers/paidLeaveController.js
const PaidLeave = require('../models/paidleaveModel');
const User = require('../models/userModel')
const Setting = require('../models/settingsModel')

exports.getAllPaidLeaves = async (req, res) => {
    try {
        const paidLeaves = await PaidLeave.find();
        res.status(200).json(paidLeaves);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getPaidLeaveById = async (req, res) => {
    try {
        const paidLeave = await PaidLeave.findById(req.params.id);
        if (!paidLeave) {
            return res.status(404).send('Paid leave date not found');
        }
        res.status(200).json(paidLeave);
    } catch (error) {
        res.status(500).send(error.message);
    }
};


// exports.addPaidLeave = async (req, res) => {
//     try {
//         const { date, reason, isPaid } = req.body;

//         // Add paid leave
//         const paidLeave = new PaidLeave({ date, reason, isPaid });
//         await paidLeave.save();
//         console.log('Paid leave added:', paidLeave);

//         // Set check-in and check-out times
//         const checkInTime = new Date(date);
//         checkInTime.setHours(9, 0, 0, 0);

//         const checkOutTime = new Date(date);
//         checkOutTime.setHours(17, 0, 0, 0);

//         // Fetch the settings
//         const settings = await Setting.findOne();
//         if (!settings) {
//             return res.status(500).json({ message: "Settings not found" });
//         }

//         const { totalDaysInMonth, workingHours } = settings;

//         // Find all users
//         const usersToUpdate = await User.find();
//         console.log('Users to update:', usersToUpdate);

//         for (const user of usersToUpdate) {
//             const attendanceRecord = user.currentMonthAttendance.find(record => record.date.toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]);
//             let dailySalary = 0;
            
//             if (isPaid) {
//                 const perDaySalary = user.salary / totalDaysInMonth; // Assuming 30 working days in a month
//                 const perHourSalary = perDaySalary / workingHours; // Assuming 8 working hours per day
//                 dailySalary = 8 * perHourSalary; // 9:00 to 17:00 is 8 hours
//                 dailySalary = Number(dailySalary.toFixed(2));
//             }

//             if (attendanceRecord) {
//                 attendanceRecord.reason = reason; // Set the reason for paid leave
//                 attendanceRecord.checkInTime = checkInTime;
//                 attendanceRecord.checkOutTime = checkOutTime;
//                 attendanceRecord.dailyWorkingHours = 8; // 9:00 to 17:00 is 8 hours
//                 attendanceRecord.dailySalary = dailySalary;
//                 console.log(`Updating attendance for user ${user._id} on date ${date}`);
//             } else {
//                 user.currentMonthAttendance.push({
//                     date: new Date(date),
//                     reason: reason,
//                     checkInTime: checkInTime,
//                     checkOutTime: checkOutTime,
//                     dailyWorkingHours: 8, // 9:00 to 17:00 is 8 hours
//                     dailySalary: dailySalary,
//                     monthlySalary: 0, // Calculate monthly salary if necessary
//                 });
//                 console.log(`Adding new attendance record for user ${user._id} on date ${date}`);
//             }
//             await user.save();
//         }

//         res.status(200).send('Paid leave date added successfully');
//     } catch (error) {
//         console.error('Error adding paid leave:', error);
//         res.status(500).send(error.message);
//     }
// };
exports.addPaidLeave = async (req, res) => {
    try {
        const { dates, reason, isPaid } = req.body;

        if (!Array.isArray(dates) || dates.length === 0) {
            return res.status(400).json({ message: "At least one date is required" });
        }

        const paidLeavePromises = dates.map(date => {
            const paidLeave = new PaidLeave({ date: new Date(date), reason, isPaid });
            return paidLeave.save();
        });
        await Promise.all(paidLeavePromises);
        console.log('Paid leave added for dates:', dates);

        const checkInTime = new Date(dates[0]);
        checkInTime.setHours(9, 0, 0, 0);

        const checkOutTime = new Date(dates[0]);
        checkOutTime.setHours(17, 0, 0, 0);

        const settings = await Setting.findOne();
        if (!settings) {
            return res.status(500).json({ message: "Settings not found" });
        }

        const { totalDaysInMonth, totalWorkingHours } = settings;
        if (!totalDaysInMonth || !totalWorkingHours) {
            return res.status(500).json({ message: "Invalid settings for totalDaysInMonth or workingHours" });
        }

        const usersToUpdate = await User.find();
        console.log('Users to update:', usersToUpdate);

        for (const user of usersToUpdate) {
            
           
            for (const date of dates) {
                const attendanceRecord = user.currentMonthAttendance.find(record => record.date.toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]);
                const perDaySalary = user.salary / totalDaysInMonth;
                const perHourSalary = perDaySalary / totalWorkingHours;
                let dailySalary = 8 * perHourSalary;

                if (isNaN(dailySalary)) {
                    console.error(`NaN detected for dailySalary: user.salary=${user.salary}, totalDaysInMonth=${totalDaysInMonth}, workingHours=${workingHours}`);
                    dailySalary = 0; // Default value or handle accordingly
                } else {
                    dailySalary = Number(dailySalary.toFixed(2));
                }

                if (attendanceRecord) {
                    attendanceRecord.reason = reason;
                    attendanceRecord.checkInTime = checkInTime;
                    attendanceRecord.checkOutTime = checkOutTime;
                    attendanceRecord.dailyWorkingHours = 8;
                    attendanceRecord.dailySalary = dailySalary;
                    console.log(`Updating attendance for user ${user._id} on date ${date}`);
                } else {
                    user.currentMonthAttendance.push({
                        date: new Date(date),
                        reason: reason,
                        checkInTime: checkInTime,
                        checkOutTime: checkOutTime,
                        dailyWorkingHours: 8,
                        dailySalary: dailySalary,
                        monthlySalary: 0,
                    });
                    console.log(`Adding new attendance record for user ${user._id} on date ${date}`);
                }
            }
            await user.save();
        }

        res.status(200).send('Paid leave dates added successfully');
    } catch (error) {
        console.error('Error adding paid leave:', error);
        res.status(500).send(error.message);
    }
};


exports.updatePaidLeave = async (req, res) => {
    try {
        const { date, reason, isPaid } = req.body;
        await PaidLeave.findByIdAndUpdate(req.params.id, { date, reason, isPaid });
        res.status(200).send('Paid leave date updated successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.updatePaidLeave = async (req, res) => {
    try {
        const { date, reason, isPaid } = req.body;
        await PaidLeave.findByIdAndUpdate(req.params.id, { date, reason, isPaid });
        res.status(200).send('Paid leave date updated successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.deletePaidLeave = async (req, res) => {
    try {
        await PaidLeave.findByIdAndDelete(req.params.id);
        res.status(200).send('Paid leave date deleted successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
};
