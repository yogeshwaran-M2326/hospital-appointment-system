const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// Override DNS for Windows Node.js MongoDB Atlas SRV resolution
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital_appointment_db';

let isMongoConnected = false;

// Initial Seed Data
const initialAppointments = [
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

    const AppointmentModel = require('../models/appointment.model');
    const count = await AppointmentModel.countDocuments();
    if (count === 0) {
      await AppointmentModel.insertMany(initialAppointments);
      console.log('[MongoDB]: Initial Seed Data Created.');
    }
  } catch (error) {
    isMongoConnected = false;
    console.error(`[MongoDB Error]: ${error.message}`);
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
  inMemoryAppointments: initialAppointments,
  doctors,
  getNextId: () => nextId++,
  getStatsFromList
};
