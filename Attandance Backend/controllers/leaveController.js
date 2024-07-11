const Leave = require("../models/leaveModel");

// Create a new leave request
exports.createLeave = async (req, res) => {
  try {
    const leave = new Leave(req.body);
    await leave.save();
    res
      .status(201)
      .send({ message: "Leave application successfully created", leave });
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all leave requests
exports.getAllLeaves = async (req, res) => {
  try {
    // Extract the role, branch, and ID of the logged-in user from req.user
    const { role, branch } = req.user;
    let leaves;
    if (role === 'admin') {
      // BranchAdmin can access only the leaves within their branch
      leaves = await Leave.find({});
      console.log(leaves)
    } else if (role === 'branchAdmin' || role === 'employee') {
      // Admin can access all leaves
      leaves = await Leave.find({
        $or: [
          { branch } // Users created by admin in the same branch
      ]
      });
      console.log(leaves)
    
    } else {
      res.status(403).json({ error: 'You do not have permission to access leaves' });
      return;
    }
    console.log(leaves)
    res.status(200).send(leaves);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};
// Get all pending leave requests
exports.getPendingLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ status: "Pending" });
    res.status(200).send(leaves);
  } catch (error) {
    res.status(500).send(error);
  }
};
// Get all leave requests for a specific employee
exports.getEmployeeLeaves = async (req, res) => {
  try {
    const employeename = req.user.username;
    const leaves = await Leave.find({ employeeName: employeename });
    res
      .status(200)
      .send({ message: "API Called SuccessFully", leaves: leaves });
  } catch (error) {
    res.status(500).send(error);
  }
};
// Get a leave request by ID
exports.getLeaveById = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).send({ message: "Leave request not found" });
    }
    res.status(200).send(leave);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a leave request
exports.updateLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!leave) {
      return res.status(404).send({ message: "Leave request not found" });
    }
    await leave.save();
    res
      .status(200)
      .send({ message: "Leave request updated successfully", leave });
  } catch (error) {
    res.status(400).send(error);
  }
};

// Approve a leave request
exports.approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true }
    );
    if (!leave) {
      return res.status(404).send({ message: "Leave request not found" });
    }
    res
      .status(200)
      .send({ message: "Leave request approved successfully", leave });
  } catch (error) {
    res.status(400).send(error);
  }
};

// Reject a leave request
exports.rejectLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      { new: true }
    );
    if (!leave) {
      return res.status(404).send({ message: "Leave request not found" });
    }
    res
      .status(200)                                                  
      .send({ message: "Leave request rejected successfully", leave });
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a leave request
exports.deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndDelete(req.params.id);
    if (!leave) {
      return res.status(404).send({ message: "Leave request not found" });
    }
    res
      .status(200)
      .send({ message: "Leave request deleted successfully", leave });
  } catch (error) {
    res.status(500).send(error);
  }
};
