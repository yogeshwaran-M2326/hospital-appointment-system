const appointmentService = require('../services/appointment.service');

class AppointmentController {
  /**
   * GET /api/appointments
   */
  async getAppointments(req, res, next) {
    try {
      const response = await appointmentService.getAllAppointments(req.query);
      res.json({
        success: true,
        message: 'Appointments fetched successfully',
        ...response
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/appointments/:id
   */
  async getAppointmentById(req, res, next) {
    try {
      const appointment = await appointmentService.getAppointmentById(req.params.id);
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment record not found'
        });
      }
      res.json({
        success: true,
        message: 'Appointment details fetched successfully',
        data: appointment,
        ...appointment
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/appointments
   */
  async createAppointment(req, res, next) {
    try {
      const result = await appointmentService.createAppointment(req.body);
      res.status(201).json({
        success: true,
        message: 'Appointment created successfully',
        data: result.data,
        stats: result.stats
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/appointments/:id
   */
  async updateAppointment(req, res, next) {
    try {
      const result = await appointmentService.updateAppointment(req.params.id, req.body);
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Appointment record not found'
        });
      }
      res.json({
        success: true,
        message: 'Appointment updated successfully',
        data: result.data,
        stats: result.stats
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/appointments/:id
   */
  async deleteAppointment(req, res, next) {
    try {
      const result = await appointmentService.deleteAppointment(req.params.id);
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Appointment record not found'
        });
      }
      res.json({
        success: true,
        message: 'Appointment deleted successfully',
        data: result.data,
        stats: result.stats
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AppointmentController();
