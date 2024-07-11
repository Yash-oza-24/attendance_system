const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attandanceController");
const authMiddleware = require("../middleware/authMiddleware");

// Route to record attendance

router.post(
  "/record",
  authMiddleware.authenticateUser,
  authMiddleware.checkUserRole(["admin"]),
  attendanceController.recordAttendance
);
router.post("/checkin", attendanceController.checkIn);
router.post("/checkout", attendanceController.checkOut);
router.put(
  "/update/:userId/:attendanceId",
  authMiddleware.authenticateUser,
  authMiddleware.checkUserRole(["admin"]),
  attendanceController.updateAttendance
);
router.delete(
  "/delete/:id",
  authMiddleware.authenticateUser,
  authMiddleware.checkUserRole(["admin"]),
  attendanceController.deleteAttendance
);
router.get(
  "/:userId",
  authMiddleware.authenticateUser,
  authMiddleware.checkUserRole(["admin", "employee", "branchAdmin"]),
  attendanceController.getAllAttendance
);
// router.get(
//   "/:userId/monthly/:month",
//   attendanceController.getMonthlyAttendance
// );

module.exports = router;
