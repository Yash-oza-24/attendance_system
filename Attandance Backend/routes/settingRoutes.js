const express = require("express");
const router = express.Router();
const settingController = require("../controllers/settingsController");
const authMiddleware = require("../middleware/authmiddleware");

// Add or Update Setting
router.post(
  "/addOrUpdate",
  authMiddleware.authenticateUser,
  // authMiddleware.checkUserRole["admin"],
  settingController.addOrUpdateSetting
);

// Get the single Setting
router.get(
  "/getsetting",
  settingController.getSetting
);

// Update Setting by ID (if needed)
router.put(
  "/update/:id",
  authMiddleware.authenticateUser,
  // authMiddleware.checkUserRole["admin"],
  settingController.updateSettingById
);

// Delete Setting by ID (not recommended for single document setup)
router.delete(
  "/delete/:id",
  authMiddleware.authenticateUser,
  // authMiddleware.checkUserRole["admin"],
  settingController.deleteSettingById
);

module.exports = router;




// const express = require("express");
// const router = express.Router();
// const settingController = require("../controllers/settingsController");
// const authMiddleware = require("../middleware/authmiddleware");

// router.post("/add", settingController.addSetting)
// router.put(
//   "/update/:id",
//   authMiddleware.authenticateUser,
//   // authMiddleware.checkUserRole["admin"],
//   settingController.updateSettingById
// );
// router.get('/all', settingController.getAllSetting);
// router.delete(
//   "/delete/:id",
//   // authMiddleware.authenticateUser,
//   settingController.deleteSettingById
// );

// module.exports = router;
