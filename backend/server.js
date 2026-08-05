const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./src/config/db.config');
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
    message: 'Hospital Appointment System Backend API is healthy',
    database: process.env.MONGODB_URI ? 'MongoDB (Configured in .env)' : 'In-Memory Store'
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Connect to Database & Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Hospital Appointment System Node.js API server running on http://localhost:${PORT}`);
  });
});
