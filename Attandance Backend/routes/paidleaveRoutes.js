// routes/paidLeaveRoutes.js
const express = require('express');
const router = express.Router();
const paidLeaveController = require('../controllers/paidleaveController');

router.get('/',  paidLeaveController.getAllPaidLeaves);
router.get('/:id', paidLeaveController.getPaidLeaveById);
router.post('/', paidLeaveController.addPaidLeave);
router.put('/:id', paidLeaveController.updatePaidLeave);
router.delete('/:id', paidLeaveController.deletePaidLeave);

module.exports = router;
