const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const { validateAppointment } = require('../middlewares/validator.middleware');

router.get('/', appointmentController.getAppointments);

router.get('/:id', appointmentController.getAppointmentById);

router.post('/', validateAppointment, appointmentController.createAppointment);

router.put('/:id', appointmentController.updateAppointment);

router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;
