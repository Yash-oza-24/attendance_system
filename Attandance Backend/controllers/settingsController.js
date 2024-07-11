// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const WorkingHours = require('../models/settingsModel')

// // Function to generate JWT token
// const generateAuthToken = (user) => {
//   return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
// };

// const login = async (req, res) => {
//   try {
//     const { email, password, mobile} = req.body;
//     let user;

//     console.log("Attempting login with", { email, password });

//     if (email) {
//       user = await Admin.findOne({ email });
//       console.log("User found by email:", user);
//     } else if (mobile) {
//       user = await Admin.findOne({ mobile });
//       console.log("User found by mobile:", user);
//     }

//     if (!user) {
//       console.log("No user found with given email or password");
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const isPasswordValid = password && bcrypt.compareSync(password, user.password);
//     if (password && !isPasswordValid) {
//       console.log("Invalid password");
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = generateAuthToken(user);

//     res.status(200).json({
//       message: 'Login successful',
//       user: {
//         _id: user._id,
//         username: user.username,
//         email: user.email,
//         mobile: user.mobile,
//         role: user.role,
//         branchName: user.branchName,
//         branchId: user.branchId
//       },
//       token
//     });
//   } catch (error) {
//     console.error("Error during login", error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// const addWorkingHours = async (req, res) => {
//   const { workingHours, totalDaysInMonth } = req.body;
//   // const userId = req.userId; // Get userId from the authenticated token

//   try {
//     const workingHoursRecord = new WorkingHours({
      
//       // workingDays,
//       workingHours,
//       totalDaysInMonth
//     });

//     await workingHoursRecord.save();

//     res.status(201).json({ message: 'Working hours added successfully', workingHoursRecord });
//   } catch (error) {
//     console.error("Error adding working hours", error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };
// const getAllWorkingHours = async (req, res) => {
//   try {
//     const workingHoursRecords = await WorkingHours.find();
//     const workingHoursRecord = workingHoursRecords.length > 0 ? workingHoursRecords[0] : null;
//     res.status(200).json(workingHoursRecord);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };          



// const updateWorkingHoursById = async (req, res) => {
//   const { id } = req.params;
//   const { workingDays, workingHours, totalDaysInMonth } = req.body;
//   const userId = req.userId; // Get userId from the authenticated token

//   try {
//     const workingHoursRecord = await WorkingHours.findOneAndUpdate(
//       { _id: id, userId },
//       { workingDays, workingHours, totalDaysInMonth },
//       { new: true }
//     );

//     if (!workingHoursRecord) {
//       return res.status(404).json({ message: 'Working hours record not found' });
//     }

//     res.status(200).json({ message: 'Working hours updated successfully', workingHoursRecord });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// const deleteWorkingHoursById = async (req, res) => {
//   const { id } = req.params;
//   const userId = req.userId; // Get userId from the authenticated token

//   try {
//     const deletedWorkingHours = await WorkingHours.findOneAndDelete({ _id: id, userId });

//     if (!deletedWorkingHours) {
//       return res.status(404).json({ message: 'Working hours record not found' });
//     }

//     res.status(200).json({ message: 'Working hours deleted successfully', deletedWorkingHours });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };


// module.exports = {
//   login,
//   addWorkingHours,
//   updateWorkingHoursById,
//   deleteWorkingHoursById,
//   getAllWorkingHours
// };



const Setting = require('../models/settingsModel');

// Add or Update Setting
const addOrUpdateSetting = async (req, res) => {
  const { totalWorkingHours, totalDaysInMonth, standardWorkingHours } = req.body;

  try {
    let settingRecord = await Setting.findOne();
    if (settingRecord) {
      // Update existing setting
      settingRecord.totalWorkingHours = totalWorkingHours;
      settingRecord.totalDaysInMonth = totalDaysInMonth;
      settingRecord.standardWorkingHours = standardWorkingHours;
      await settingRecord.save();
      res.status(200).json({ message: 'Settings updated successfully', settingRecord });
    } else {
      // Create new setting
      settingRecord = new Setting({
        totalWorkingHours,
        totalDaysInMonth,
        standardWorkingHours
      });
      await settingRecord.save();
      res.status(201).json({ message: 'Settings added successfully', settingRecord });
    }
  } catch (error) {
    console.error("Error adding or updating settings", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get the Setting
const getSetting = async (req, res) => {
  try {
    const settingRecord = await Setting.findOne();
    if (settingRecord) {
      res.status(200).json(settingRecord);
    } else {
      res.status(404).json({ message: 'No settings found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update the Setting by ID (Not needed if we are ensuring only one document)
const updateSettingById = async (req, res) => {
  const { id } = req.params;
  const { totalWorkingHours, totalDaysInMonth, standardWorkingHours } = req.body;

  try {
    const settingRecord = await Setting.findById(id);
    if (!settingRecord) {
      return res.status(404).json({ message: 'Setting not found' });
    }

    settingRecord.totalWorkingHours = totalWorkingHours;
    settingRecord.totalDaysInMonth = totalDaysInMonth;
    settingRecord.standardWorkingHours = standardWorkingHours;
    await settingRecord.save();

    res.status(200).json({ message: 'Settings updated successfully', settingRecord });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete the Setting by ID (Not recommended if only one document should exist)
const deleteSettingById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSetting = await Setting.findByIdAndDelete(id);

    if (!deletedSetting) {
      return res.status(404).json({ message: 'Setting not found' });
    }

    res.status(200).json({ message: 'Setting deleted successfully', deletedSetting });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  addOrUpdateSetting,
  getSetting,
  updateSettingById,
  deleteSettingById
};
