const express = require("express");
const leaveController = require("../controllers/leaveController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Route to create a new leave request
router.post(
  "/",
  authMiddleware.authenticateUser,
  authMiddleware.checkUserRole(["branchAdmin", "employee"]),
  leaveController.createLeave
);

// Route to get all leave requests
router.get(
  "/",
  authMiddleware.authenticateUser,
  authMiddleware.checkUserRole(["admin", "branchAdmin", "employee"]),
  leaveController.getAllLeaves
);

// Route to get all pending leave requests
router.get(
  "/pending",
  authMiddleware.authenticateUser,
  authMiddleware.checkUserRole(["admin"]),
  leaveController.getPendingLeaves
);

// Route to get a leave request by ID
router.get(
  "/:id",
  authMiddleware.authenticateUser,
  authMiddleware.checkUserRole(["admin"]),
  leaveController.getLeaveById
);
router.get(
  "/employee-leaves/:id",
  authMiddleware.authenticateUser,
  authMiddleware.checkUserRole(["employee"]),
  leaveController.getEmployeeLeaves
);

// Route to update a leave request
router.put(
  "/:id",
  authMiddleware.authenticateUser,
  authMiddleware.checkUserRole(["branchAdmin" , "employee"]),
  leaveController.updateLeave
);

// Route to approve a leave request
router.put(
  "/approve/:id",
  // authMiddleware.authenticateUser,
  // authMiddleware.checkUserRole(["admin"]),
  leaveController.approveLeave
);

// Route to reject a leave request
router.put(
  "/reject/:id",
  // authMiddleware.authenticateUser,
  // authMiddleware.checkUserRole(["admin"]),
  leaveController.rejectLeave
);

// Route to delete a leave request
router.delete(
  "/:id",
  authMiddleware.authenticateUser,
  authMiddleware.checkUserRole(["branchAdmin" , "employee"]),
  leaveController.deleteLeave
);

module.exports = router;
