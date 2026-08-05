const { doctors } = require('../config/db.config');

class DoctorController {
  getDoctors(req, res, next) {
    try {
      res.json({
        success: true,
        message: 'Doctor list fetched successfully',
        data: doctors
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DoctorController();
