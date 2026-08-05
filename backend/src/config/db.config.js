const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// Override DNS for Windows Node.js MongoDB Atlas SRV resolution
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital_appointment_db';

let isMongoConnected = false;

// Empty Appointments Store (No Dummy Seed Data)
let inMemoryAppointments = [];
let nextId = 1;

// Doctor Masters list for dropdown selection
const doctors = [
  { id: 1, label: 'Dr. Robert Kumar (Cardiology)', value: 'Dr. Robert Kumar', department: 'Cardiology' },
  { id: 2, label: 'Dr. Emily Vance (Neurology)', value: 'Dr. Emily Vance', department: 'Neurology' },
  { id: 3, label: 'Dr. Gregory House (Orthopedics)', value: 'Dr. Gregory House', department: 'Orthopedics' },
  { id: 4, label: 'Dr. Sarah Connor (Pediatrics)', value: 'Dr. Sarah Connor', department: 'Pediatrics' },
  { id: 5, label: 'Dr. John Watson (General Medicine)', value: 'Dr. John Watson', department: 'General Medicine' }
];

/**
 * MongoDB Database Connection Function
 */
async function connectDB() {
  try {
    let uri = MONGODB_URI.trim();

    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    } catch (firstErr) {
      if (uri.includes('%40')) {
        uri = uri.replace('%40', '@');
      } else if (uri.includes('Yogesh@23')) {
        uri = uri.replace('Yogesh@23', 'Yogesh%4023');
      }
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    }

    isMongoConnected = true;
    console.log('[MongoDB]: Connected to Database Successfully!');

    // Clean up any remaining dummy seed data from MongoDB collection
    const AppointmentModel = require('../models/appointment.model');
    await AppointmentModel.deleteMany({
      patientName: { $in: ['John Smith', 'Sarah Jenkins'] }
    });
    console.log('[MongoDB]: Purged old dummy records from database.');
  } catch (error) {
    isMongoConnected = false;
    console.warn(`[MongoDB Warning]: ${error.message}. Operating in memory mode.`);
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
