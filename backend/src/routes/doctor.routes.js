const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');

// GET /api/doctors (Get doctors list for dropdowns)
router.get('/', doctorController.getDoctors);

module.exports = router;
