/**
 * Validation Middleware for Appointment Payload
 */
function validateAppointment(req, res, next) {
  const { patientName, doctorName, department, appointmentDate, appointmentTime, contactNumber, status } = req.body;

  if (!patientName || !patientName.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Patient Name is required.'
    });
  }

  if (!doctorName || !doctorName.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Doctor Name is required.'
    });
  }

  if (!department || !department.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Department is required.'
    });
  }

  if (!appointmentDate) {
    return res.status(400).json({
      success: false,
      message: 'Appointment Date is required.'
    });
  }

  if (!appointmentTime) {
    return res.status(400).json({
      success: false,
      message: 'Appointment Time is required.'
    });
  }

  if (!contactNumber || !contactNumber.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Contact Number is required.'
    });
  }

  if (!status) {
    return res.status(400).json({
      success: false,
      message: 'Status is required.'
    });
  }

  next();
}

module.exports = {
  validateAppointment
};
