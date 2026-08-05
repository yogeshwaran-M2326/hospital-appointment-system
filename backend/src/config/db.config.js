const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital_appointment_db';

let isMongoConnected = false;

// Default In-Memory Seed Data (Used as initial seed for MongoDB or fallback)
let inMemoryAppointments = [
  {
    id: 1,
    patientName: 'John Smith',
    doctorName: 'Dr. Robert Kumar',
    department: 'Cardiology',
    appointmentDate: '2026-08-10',
    appointmentTime: '10:30 AM',
    contactNumber: '9876543210',
    status: 'Scheduled',
    description: 'Routine cardiac checkup'
  },
  {
    id: 2,
    patientName: 'Sarah Jenkins',
    doctorName: 'Dr. Emily Vance',
    department: 'Neurology',
    appointmentDate: '2026-08-11',
    appointmentTime: '02:00 PM',
    contactNumber: '9988776655',
    status: 'Completed',
    description: 'Follow-up consult'
  }
];

let nextId = 3;

const doctors = [
  { id: 1, label: 'Dr. Robert Kumar (Cardiology)', value: 'Dr. Robert Kumar', department: 'Cardiology' },
  { id: 2, label: 'Dr. Emily Vance (Neurology)', value: 'Dr. Emily Vance', department: 'Neurology' },
  { id: 3, label: 'Dr. Gregory House (Orthopedics)', value: 'Dr. Gregory House', department: 'Orthopedics' },
  { id: 4, label: 'Dr. Sarah Connor (Pediatrics)', value: 'Dr. Sarah Connor', department: 'Pediatrics' },
  { id: 5, label: 'Dr. John Watson (General Medicine)', value: 'Dr. John Watson', department: 'General Medicine' }
];

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000 // Fast 3 second connection attempt
    });
    isMongoConnected = true;
    console.log(`[MongoDB]: Successfully connected to database at ${MONGODB_URI}`);
    
    // Seed initial MongoDB data if collection is empty
    const AppointmentModel = require('../models/appointment.model');
    const count = await AppointmentModel.countDocuments();
    if (count === 0) {
      await AppointmentModel.insertMany(inMemoryAppointments);
      console.log('[MongoDB]: Seeded initial appointment records into MongoDB collection.');
    }
  } catch (error) {
    isMongoConnected = false;
    console.warn(`[MongoDB Warning]: Could not connect to MongoDB at ${MONGODB_URI}. Operating in-memory mode. (${error.message})`);
  }
}

function getStatsFromList(list) {
  return {
    total: list.length,
    scheduled: list.filter(a => a.status === 'Scheduled').length,
    completed: list.filter(a => a.status === 'Completed').length,
    cancelled: list.filter(a => a.status === 'Cancelled').length
  };
}

module.exports = {
  connectDB,
  isMongoConnected: () => isMongoConnected,
  inMemoryAppointments,
  doctors,
  getNextId: () => nextId++,
  getStatsFromList
};
