const express = require('express');
const cors = require('cors');
const appointmentRoutes = require('./src/routes/appointment.routes');
const doctorRoutes = require('./src/routes/doctor.routes');
const errorHandler = require('./src/middlewares/errorHandler.middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Global Middlewares
app.use(cors());
app.use(express.json());

// API Routes Mount
app.use('/api/appointments', appointmentRoutes);
app.use('/api/doctors', doctorRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Hospital Appointment System Backend API is healthy'
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start Node.js Express Server
app.listen(PORT, () => {
  console.log(`Hospital Appointment System Node.js API server running on http://localhost:${PORT}`);
});
