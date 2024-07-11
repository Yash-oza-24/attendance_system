// const dayjs = require("dayjs");
// const User = require("../models/userModel");
// const Setting = require("../models/settingsModel");

// const attendanceController = {
//   recordAttendance: async (req, res) => {
//     try {
//       const { userId, date, checkInTime, checkOutTime, reason } = req.body;

//       // Validate required fields
//       if (!userId || !date || !checkInTime || !checkOutTime) {
//         return res.status(400).json({ message: "Missing required fields" });
//       }

//       // Use provided date and times
//       const attendanceDate = dayjs(date, "YYYY-MM-DD").startOf("day");
//       const startTime = dayjs(checkInTime);
//       const endTime = dayjs(checkOutTime);

//       if (
//         !attendanceDate.isValid() ||
//         !startTime.isValid() ||
//         !endTime.isValid()
//       ) {
//         return res.status(400).json({ message: "Invalid date or time format" });
//       }

//       const dailyWorkingHours = endTime.diff(startTime, "hour", true); // Calculate working hours, use 'hour' with true for fractional hours

//       // Ensure working hours are positive and make sense
//       if (dailyWorkingHours <= 0) {
//         return res
//           .status(400)
//           .json({ message: "Check-out time must be after check-in time" });
//       }

//       let user = await User.findById(userId);
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }
//       // Fetch the settings
//       const settings = await Setting.findOne();
//       if (!settings) {
//         return res.status(500).json({ message: "Settings not found" });
//       }
//       const { totalDaysInMonth, workingHours } = settings;
//       const perDaySalary = user.salary / totalDaysInMonth; // Assuming 30 working days in a month
//       const perHourSalary = perDaySalary / workingHours; // Assuming 8 working hours per day
//       let dailySalary = dailyWorkingHours * perHourSalary;
//       dailySalary = Number(dailySalary.toFixed(2));

//       const attendance = {
//         date: attendanceDate.toDate(),
//         checkInTime: startTime.toDate(),
//         checkOutTime: endTime.toDate(),
//         reason: reason || "",
//         dailyWorkingHours: dailyWorkingHours,
//         dailySalary: dailySalary,
//       };

//       // Get the month of the attendance date
//       const attendanceMonth = attendanceDate.format("YYYY-MM");

//       // Check if the current month's data should be moved
//       if (user.currentMonthAttendance.length > 0) {
//         const lastEntryDate = dayjs(
//           user.currentMonthAttendance[user.currentMonthAttendance.length - 1]
//             .date
//         );
//         const lastEntryMonth = lastEntryDate.format("YYYY-MM");

//         if (lastEntryMonth !== attendanceMonth) {
//           // Calculate total working hours and total salary for the last month
//           let totalWorkingHours = 0;
//           let totalSalary = 0;
//           user.currentMonthAttendance.forEach((day) => {
//             totalWorkingHours += day.dailyWorkingHours;
//             totalSalary += day.dailySalary;
//           });

//           // Move data to monthlyAttendance
//           user.currentMonthAttendance.push({
//             month: lastEntryMonth,
//             attendance: user.currentMonthAttendance,
//             monthlySalary: totalSalary,
//           });
//           // Reset currentMonthAttendance
//           user.currentMonthAttendance = [];
//         }
//       }

//       // Check if there is already an attendance record for the specified date
//       const existingAttendanceIndex = user.currentMonthAttendance.findIndex(
//         (record) => {
//           return dayjs(record.date).isSame(attendanceDate, "day");
//         }
//       );

//       if (existingAttendanceIndex !== -1) {
//         // Attendance for the given date already exists, return a message
//         return res
//           .status(400)
//           .json({
//             message:
//               "You can't add attendance for this date. You can only update the existing attendance record.",
//           });
//       }

//       // Add the attendance to currentMonthAttendance
//       user.currentMonthAttendance.push(attendance);

//       await user.save();
//       res.json(attendance);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   },
//   updateAttendance: async (req, res) => {
//     console.log(req.body);
//     try {
//       const { userId, attendanceId } = req.params;
//       const { checkInTime, checkOutTime, reason } = req.body;
//       console.log(checkInTime);
//       console.log(checkOutTime);
//       console.log(req.body);

//       // Parse check-in and check-out times using dayjs
//       const startTime = dayjs(checkInTime);
//       const endTime = dayjs(checkOutTime);

//       // Calculate daily working hours
//       const dailyWorkingHours = endTime.diff(startTime, "hour");

//       // Find user by userId
//       const user = await User.findById(userId);
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }
//       console.log(user);

//       // Ensure currentMonthAttendance is an array and find attendance record by attendanceId
//       const currentMonth = user.currentMonthAttendance || [];
//       const attendance = currentMonth.find(
//         (att) => att._id.toString() === attendanceId
//       );

//       if (!attendance) {
//         return res.status(404).json({ message: "Attendance record not found" });
//       }

//       console.log(attendance);

//       // Calculate salary details
//       const perDaySalary = user.salary / 30;
//       const perHourSalary = perDaySalary / 8;
//       const dailySalary = Number(
//         (dailyWorkingHours * perHourSalary).toFixed(2)
//       );

//       // Update attendance details
//       attendance.date = startTime.toDate();

//       attendance.checkInTime = startTime.toDate();
//       attendance.checkOutTime = endTime.toDate();
//       attendance.reason = reason;
//       attendance.dailyWorkingHours = dailyWorkingHours;
//       attendance.dailySalary = dailySalary;

//       // Save user document with updated attendance details
//       await user.save();
//       res.json(attendance);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   },
//   // getAllAttendance: async (req, res) => {
//   //   try {
//   //     const { userId } = req.params;
//   //     const today = dayjs();
//   //     const currentMonth = today.format("YYYY-MM");

//   //     let user = await User.findById(userId);
//   //     if (!user) {
//   //       return res.status(404).json({ message: "User not found" });
//   //     }

//   //     const currentMonthAttendance = user.currentMonthAttendance.filter(
//   //       (att) => dayjs(att.date).format("YYYY-MM") === currentMonth
//   //     );
//   //     res.json(
//   //       currentMonthAttendance,

//   //     );

//   //   } catch (error) {
//   //     res.status(500).json({ message: error.message });
//   //   }
//   // },
//   getAllAttendance: async (req, res) => {
//     try {
//       const { userId } = req.params;
//       let user = await User.findById(userId);
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       res.json(user.currentMonthAttendance);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   },

//   deleteAttendance: async (req, res) => {
//     try {
//       const { id } = req.params; // Assuming the ID is passed as a URL parameter
//       let user = await User.findOne({ "currentMonthAttendance._id": id });
//       if (!user) {
//         return res.status(404).json({ message: "Attendance record not found" });
//       }

//       // Find the index of the attendance record with the given ID
//       const attendanceIndex = user.currentMonthAttendance.findIndex(
//         (att) => att._id.toString() === id
//       );
//       if (attendanceIndex === -1) {
//         return res.status(404).json({ message: "Attendance record not found" });
//       }

//       // Remove the attendance record from the array
//       user.currentMonthAttendance.splice(attendanceIndex, 1);

//       await user.save();
//       res.json({ message: "Attendance record deleted successfully" });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   },

//   checkIn: async (req, res) => {
//     try {
//       const { userId, checkInTime } = req.body;
//       const today = dayjs().startOf("day");
//       const startTime = dayjs(checkInTime);

//       let user = await User.findById(userId);
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       // Check if user already checked in today
//       const existingAttendanceIndex = user.currentMonthAttendance.findIndex(
//         (att) => dayjs(att.date).isSame(today, "day")
//       );
//       if (existingAttendanceIndex !== -1) {
//         return res
//           .status(400)
//           .json({ message: "User already checked in today" });
//       }

//       const attendance = {
//         date: today.toDate(),
//         checkInTime: startTime.toDate(),
//       };

//       // Add today's check-in to currentMonthAttendance
//       user.currentMonthAttendance.push(attendance);

//       await user.save();
//       res.json(attendance);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   },

//   checkOut: async (req, res) => {
//     try {
//       const { userId, checkOutTime } = req.body;
//       const today = dayjs().startOf("day"); // Normalize to start of the day
//       const endTime = dayjs(checkOutTime);
//       let user = await User.findById(userId);
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }
//       // Find today's attendance record
//       const attendanceIndex = user.currentMonthAttendance.findIndex((att) =>
//         dayjs(att.date).isSame(today, "day")
//       );
//       if (attendanceIndex === -1) {
//         return res
//           .status(404)
//           .json({ message: "Check-in record not found for today" });
//       }
//       const startTime = dayjs(
//         user.currentMonthAttendance[attendanceIndex].checkInTime
//       );
//       const dailyWorkingHours = endTime.diff(startTime, "hour");
//       const perDaySalary = user.salary / 30;
//       const perHourSalary = perDaySalary / 8;
//       let dailySalary = dailyWorkingHours * perHourSalary;
//       dailySalary = Number(dailySalary.toFixed(2));
//       user.currentMonthAttendance[attendanceIndex] = {
//         ...user.currentMonthAttendance[attendanceIndex],
//         date: today.toDate(),
//         checkInTime: startTime.toDate(),
//         checkOutTime: endTime.toDate(),
//         dailyWorkingHours,
//         dailySalary,
//       };
//       await user.save();
//       res.json(user.currentMonthAttendance[attendanceIndex]);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   },
// };

// module.exports = attendanceController;
const dayjs = require("dayjs");
const User = require("../models/userModel");
const Setting = require("../models/settingsModel");

const attendanceController = {
  recordAttendance: async (req, res) => {
    try {
      const { userId, date, checkInTime, checkOutTime, reason } = req.body;

      // Validate required fields
      if (!userId || !date || !checkInTime || !checkOutTime) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Use provided date and times
      const attendanceDate = dayjs(date, "YYYY-MM-DD").startOf("day");
      const startTime = dayjs(checkInTime);
      const endTime = dayjs(checkOutTime);

      if (
        !attendanceDate.isValid() ||
        !startTime.isValid() ||
        !endTime.isValid()
      ) {
        return res.status(400).json({ message: "Invalid date or time format" });
      }

      const dailyWorkingHours = endTime.diff(startTime, "hour", true); // Calculate working hours, use 'hour' with true for fractional hours

      // Ensure working hours are positive and make sense
      if (dailyWorkingHours <= 0) {
        return res
          .status(400)
          .json({ message: "Check-out time must be after check-in time" });
      }

      let user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Fetch the settings
      const settings = await Setting.findOne();
      if (!settings) {
        return res.status(500).json({ message: "Settings not found" });
      }
      const { totalDaysInMonth, totalWorkingHours, standardWorkingHours } = settings;
      const perDaySalary = user.salary / totalDaysInMonth; // Assuming 30 working days in a month
      const perHourSalary = perDaySalary / totalWorkingHours; // Assuming 8 working hours per day
      let dailySalary = dailyWorkingHours * perHourSalary;
      dailySalary = Number(dailySalary.toFixed(2));

 
      // Calculate late time and overtime
      const standardStartTime = dayjs(standardWorkingHours.start, "HH:mm");
      const standardEndTime = dayjs(standardWorkingHours.end, "HH:mm");

    
      // Inside your async function
      let lateTimeFormatted = null;
      let overTimeFormatted = null;

      if (startTime.isAfter(standardStartTime)) {
        const lateMinutes = startTime.diff(standardStartTime, "minute");
        lateTimeFormatted = dayjs().startOf('day').add(lateMinutes, 'minute').toDate().toISOString();
      }

      if (endTime.isAfter(standardEndTime)) {
        const overTimeMinutes = endTime.diff(standardEndTime, "minute");
        overTimeFormatted = dayjs().startOf('day').add(overTimeMinutes, 'minute').toDate().toISOString();;
      }

      const attendance = {
        date: attendanceDate.toDate(),
        checkInTime: startTime.toDate(),
        checkOutTime: endTime.toDate(),
        reason: reason || "",
        dailyWorkingHours: dailyWorkingHours,
        dailySalary: dailySalary,
        lateTime: lateTimeFormatted,
        overTime: overTimeFormatted
      };

      // Get the month of the attendance date
      const attendanceMonth = attendanceDate.format("YYYY-MM");

      // Check if the current month's data should be moved
      if (user.currentMonthAttendance.length > 0) {
        const lastEntryDate = dayjs(
          user.currentMonthAttendance[user.currentMonthAttendance.length - 1]
            .date
        );
        const lastEntryMonth = lastEntryDate.format("YYYY-MM");

        if (lastEntryMonth !== attendanceMonth) {
          // Calculate total working hours and total salary for the last month
          let totalWorkingHours = 0;
          let totalSalary = 0;
          user.currentMonthAttendance.forEach((day) => {
            totalWorkingHours += day.dailyWorkingHours;
            totalSalary += day.dailySalary;
          });

          // Move data to monthlyAttendance
          user.currentMonthAttendance.push({
            month: lastEntryMonth,
            attendance: user.currentMonthAttendance,
            monthlySalary: totalSalary,
          });
          // Reset currentMonthAttendance
          user.currentMonthAttendance = [];
        }
      }

      // Check if there is already an attendance record for the specified date
      const existingAttendanceIndex = user.currentMonthAttendance.findIndex(
        (record) => {
          return dayjs(record.date).isSame(attendanceDate, "day");
        }
      );

      if (existingAttendanceIndex !== -1) {
        // Attendance for the given date already exists, return a message
        return res
          .status(400)
          .json({
            message:
              "You can't add attendance for this date. You can only update the existing attendance record.",
          });
      }

      // Add the attendance to currentMonthAttendance
      user.currentMonthAttendance.push(attendance);

      await user.save();
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },


  updateAttendance: async (req, res) => {
    console.log(req.body);
    try {
      const { userId, attendanceId } = req.params;
      const { checkInTime, checkOutTime, reason } = req.body;
      console.log(checkInTime);
      console.log(checkOutTime);
      console.log(req.body);

      // Parse check-in and check-out times using dayjs
      const startTime = dayjs(checkInTime);
      const endTime = dayjs(checkOutTime);

      // Validate check-in and check-out times
      if (!startTime.isValid() || !endTime.isValid()) {
        return res.status(400).json({ message: "Invalid check-in or check-out time" });
      }

      // Calculate daily working hours
      const dailyWorkingHours = endTime.diff(startTime, "hour", true); // Using true for fractional hours

      // Ensure daily working hours are positive and make sense
      if (dailyWorkingHours <= 0) {
        return res.status(400).json({ message: "Check-out time must be after check-in time" });
      }

      // Find user by userId
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      console.log(user);

      // Ensure currentMonthAttendance is an array and find attendance record by attendanceId
      const currentMonth = user.currentMonthAttendance || [];
      const attendanceIndex = currentMonth.findIndex(
        (att) => att._id.toString() === attendanceId
      );

      if (attendanceIndex === -1) {
        return res.status(404).json({ message: "Attendance record not found" });
      }

      // Fetch settings
      const settings = await Setting.findOne();
      if (!settings) {
        return res.status(500).json({ message: "Settings not found" });
      }

      const { totalDaysInMonth, totalWorkingHours, standardWorkingHours } = settings;

      // Calculate salary details
      const perDaySalary = user.salary / totalDaysInMonth;
      const perHourSalary = perDaySalary / totalWorkingHours;
      let dailySalary = dailyWorkingHours * perHourSalary;
      dailySalary = Number(dailySalary.toFixed(2));

      // Calculate late time and overtime
      const standardStartTime = dayjs(standardWorkingHours.start, "HH:mm");
      const standardEndTime = dayjs(standardWorkingHours.end, "HH:mm");

      let lateTimeFormatted = null;
      let overTimeFormatted = null;

      if (startTime.isAfter(standardStartTime)) {
        const lateMinutes = startTime.diff(standardStartTime, "minute");
        lateTimeFormatted = dayjs().startOf('day').add(lateMinutes, 'minute').toDate().toISOString();
      }

      if (endTime.isAfter(standardEndTime)) {
        const overTimeMinutes = endTime.diff(standardEndTime, "minute");
        overTimeFormatted = dayjs().startOf('day').add(overTimeMinutes, 'minute').toDate().toISOString();;
      }

      // Update attendance details
      currentMonth[attendanceIndex].checkInTime = startTime.toDate();
      currentMonth[attendanceIndex].checkOutTime = endTime.toDate();
      currentMonth[attendanceIndex].reason = reason || "";
      currentMonth[attendanceIndex].dailyWorkingHours = dailyWorkingHours;
      currentMonth[attendanceIndex].dailySalary = dailySalary;
      currentMonth[attendanceIndex].lateTime = lateTimeFormatted;
      currentMonth[attendanceIndex].overTime = overTimeFormatted;

      // Save user document with updated attendance details
      await user.save();
      res.json(currentMonth[attendanceIndex]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },




  //////////////////////////////////////////////////////
  // getAllAttendance: async (req, res) => {
  //   try {
  //     const { userId } = req.params;
  //     const today = dayjs();
  //     const currentMonth = today.format("YYYY-MM");

  //     let user = await User.findById(userId);
  //     if (!user) {
  //       return res.status(404).json({ message: "User not found" });
  //     }

  //     const currentMonthAttendance = user.currentMonthAttendance.filter(
  //       (att) => dayjs(att.date).format("YYYY-MM") === currentMonth
  //     );
  //     res.json(
  //       currentMonthAttendance,

  //     );

  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // },
  getAllAttendance: async (req, res) => {
    try {
      const { userId } = req.params;
      let user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user.currentMonthAttendance);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteAttendance: async (req, res) => {
    try {
      const { id } = req.params; // Assuming the ID is passed as a URL parameter
      let user = await User.findOne({ "currentMonthAttendance._id": id });
      if (!user) {
        return res.status(404).json({ message: "Attendance record not found" });
      }

      // Find the index of the attendance record with the given ID
      const attendanceIndex = user.currentMonthAttendance.findIndex(
        (att) => att._id.toString() === id
      );
      if (attendanceIndex === -1) {
        return res.status(404).json({ message: "Attendance record not found" });
      }

      // Remove the attendance record from the array
      user.currentMonthAttendance.splice(attendanceIndex, 1);

      await user.save();
      res.json({ message: "Attendance record deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  checkIn: async (req, res) => {
    try {
      const { userId, checkInTime } = req.body;
      const today = dayjs().startOf("day");
      const startTime = dayjs(checkInTime);

      let user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user already checked in today
      const existingAttendanceIndex = user.currentMonthAttendance.findIndex(
        (att) => dayjs(att.date).isSame(today, "day")
      );
      if (existingAttendanceIndex !== -1) {
        return res
          .status(400)
          .json({ message: "User already checked in today" });
      }

      const attendance = {
        date: today.toDate(),
        checkInTime: startTime.toDate(),
      };

      // Add today's check-in to currentMonthAttendance
      user.currentMonthAttendance.push(attendance);

      await user.save();
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  checkOut: async (req, res) => {
    try {
      const { userId, checkOutTime } = req.body;
      const today = dayjs().startOf("day"); // Normalize to start of the day
      const endTime = dayjs(checkOutTime);
      let user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Find today's attendance record
      const attendanceIndex = user.currentMonthAttendance.findIndex((att) =>
        dayjs(att.date).isSame(today, "day")
      );
      if (attendanceIndex === -1) {
        return res
          .status(404)
          .json({ message: "Check-in record not found for today" });
      }
      const startTime = dayjs(
        user.currentMonthAttendance[attendanceIndex].checkInTime
      );
      const dailyWorkingHours = endTime.diff(startTime, "hour");
      const perDaySalary = user.salary / 30;
      const perHourSalary = perDaySalary / 8;
      let dailySalary = dailyWorkingHours * perHourSalary;
      dailySalary = Number(dailySalary.toFixed(2));
      user.currentMonthAttendance[attendanceIndex] = {
        ...user.currentMonthAttendance[attendanceIndex],
        date: today.toDate(),
        checkInTime: startTime.toDate(),
        checkOutTime: endTime.toDate(),
        dailyWorkingHours,
        dailySalary,
      };
      await user.save();
      res.json(user.currentMonthAttendance[attendanceIndex]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = attendanceController;
