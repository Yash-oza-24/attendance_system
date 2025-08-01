// userRoutes.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Login Route
router.post("/login", userController.loginUser);

//init admin
router.post(
  "/initadmin",
  authMiddleware.authenticateUser,
  authMiddleware.checkUserRole(["admin"]),
  userController.createInitialAdmin
);

// Add User Route
router.post(
  "/add",
  authMiddleware.authenticateUser,
  authMiddleware.checkUserRole(["admin", "branchAdmin"]),
  userController.addUser
);

// Get All Users Route
router.get(
  "/all",
  authMiddleware.authenticateUser,
  authMiddleware.checkUserRole(["admin", "branchAdmin"]),
  userController.getAllUsers
);

// Get All Employee Route
router.get(
  "/allemployees",
  authMiddleware.authenticateUser,
  authMiddleware.checkUserRole(["admin", "branchAdmin"]),
  userController.getAllEmployees
);
router.get(
  "/allbranches",
  authMiddleware.authenticateUser,
  authMiddleware.checkUserRole(["admin", "branchAdmin"]),
  userController.getAllBracnhes
);
// Delete User by ID Route
router.delete(
  "/:userId",
  authMiddleware.authenticateUser,
  authMiddleware.checkUserRole(["admin", "branchAdmin"]),
  userController.deleteUserById
);

// Update User by ID Route
router.put(
  "/:userId",
  authMiddleware.authenticateUser,
  authMiddleware.checkUserRole(["admin", "branchAdmin"]),
  userController.updateUserById
);

// Get User by ID Route
router.get(
  "/:userId",
  authMiddleware.authenticateUser,
  userController.getUserById
);

module.exports = router;
