const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const { validateAppointment } = require('../middlewares/validator.middleware');

// GET /api/appointments (Get list with search, filter, sort, pagination)
router.get('/', appointmentController.getAppointments);

// GET /api/appointments/:id (Get single appointment by ID)
router.get('/:id', appointmentController.getAppointmentById);

// POST /api/appointments (Create new appointment)
router.post('/', validateAppointment, appointmentController.createAppointment);

// PUT /api/appointments/:id (Update appointment)
router.put('/:id', appointmentController.updateAppointment);

// DELETE /api/appointments/:id (Delete appointment)
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;
