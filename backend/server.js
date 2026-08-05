const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-Memory Database Store with Seed Data
let appointments = [
  {
    id: 101,
    patientName: 'Sarah Jenkins',
    doctorName: 'Dr. Robert Kumar',
    department: 'Cardiology',
    appointmentDate: '2026-08-10',
    appointmentTime: '10:30 AM',
    contactNumber: '9876543210',
    status: 'Scheduled',
    description: 'Routine cardiac checkup'
  },
  {
    id: 102,
    patientName: 'Alex Mercer',
    doctorName: 'Dr. Emily Vance',
    department: 'Neurology',
    appointmentDate: '2026-08-11',
    appointmentTime: '02:00 PM',
    contactNumber: '9988776655',
    status: 'Completed',
    description: 'Follow-up consult'
  },
  {
    id: 103,
    patientName: 'Michael Scott',
    doctorName: 'Dr. Gregory House',
    department: 'Orthopedics',
    appointmentDate: '2026-08-12',
    appointmentTime: '09:15 AM',
    contactNumber: '9123456789',
    status: 'Cancelled',
    description: 'Knee joint consultation'
  },
  {
    id: 104,
    patientName: 'Elena Rostova',
    doctorName: 'Dr. Sarah Connor',
    department: 'Pediatrics',
    appointmentDate: '2026-08-14',
    appointmentTime: '11:00 AM',
    contactNumber: '9845012345',
    status: 'Scheduled',
    description: 'General pediatric wellness check'
  },
  {
    id: 105,
    patientName: 'David Beckham',
    doctorName: 'Dr. John Watson',
    department: 'General Medicine',
    appointmentDate: '2026-08-15',
    appointmentTime: '04:30 PM',
    contactNumber: '9765432109',
    status: 'Completed',
    description: 'Annual health checkup'
  },
  {
    id: 106,
    patientName: 'Priya Sharma',
    doctorName: 'Dr. Robert Kumar',
    department: 'Cardiology',
    appointmentDate: '2026-08-16',
    appointmentTime: '09:30 AM',
    contactNumber: '9812345678',
    status: 'Scheduled',
    description: 'ECG Review'
  },
  {
    id: 107,
    patientName: 'Daniel Craig',
    doctorName: 'Dr. Emily Vance',
    department: 'Neurology',
    appointmentDate: '2026-08-17',
    appointmentTime: '03:15 PM',
    contactNumber: '9711223344',
    status: 'Scheduled',
    description: 'Migraine evaluation'
  },
  {
    id: 108,
    patientName: 'Kavitha Ramesh',
    doctorName: 'Dr. Gregory House',
    department: 'Orthopedics',
    appointmentDate: '2026-08-18',
    appointmentTime: '10:00 AM',
    contactNumber: '9622334455',
    status: 'Completed',
    description: 'Post-surgery review'
  },
  {
    id: 109,
    patientName: 'James Bond',
    doctorName: 'Dr. Sarah Connor',
    department: 'Pediatrics',
    appointmentDate: '2026-08-19',
    appointmentTime: '01:30 PM',
    contactNumber: '9533445566',
    status: 'Cancelled',
    description: 'Vaccination'
  },
  {
    id: 110,
    patientName: 'Anand Viswanathan',
    doctorName: 'Dr. John Watson',
    department: 'General Medicine',
    appointmentDate: '2026-08-20',
    appointmentTime: '05:00 PM',
    contactNumber: '9444556677',
    status: 'Scheduled',
    description: 'Blood pressure monitoring'
  },
  {
    id: 111,
    patientName: 'Emma Watson',
    doctorName: 'Dr. Robert Kumar',
    department: 'Cardiology',
    appointmentDate: '2026-08-21',
    appointmentTime: '11:30 AM',
    contactNumber: '9355667788',
    status: 'Completed',
    description: 'Heart rate consultation'
  },
  {
    id: 112,
    patientName: 'Suresh Kumar',
    doctorName: 'Dr. Emily Vance',
    department: 'Neurology',
    appointmentDate: '2026-08-22',
    appointmentTime: '02:30 PM',
    contactNumber: '9266778899',
    status: 'Scheduled',
    description: 'Brain MRI follow-up'
  }
];

let nextId = 113;

const doctors = [
  { id: 1, label: 'Dr. Robert Kumar (Cardiology)', value: 'Dr. Robert Kumar', department: 'Cardiology' },
  { id: 2, label: 'Dr. Emily Vance (Neurology)', value: 'Dr. Emily Vance', department: 'Neurology' },
  { id: 3, label: 'Dr. Gregory House (Orthopedics)', value: 'Dr. Gregory House', department: 'Orthopedics' },
  { id: 4, label: 'Dr. Sarah Connor (Pediatrics)', value: 'Dr. Sarah Connor', department: 'Pediatrics' },
  { id: 5, label: 'Dr. John Watson (General Medicine)', value: 'Dr. John Watson', department: 'General Medicine' }
];

// Helper: Stats calculation
function getStats() {
  return {
    total: appointments.length,
    scheduled: appointments.filter(a => a.status === 'Scheduled').length,
    completed: appointments.filter(a => a.status === 'Completed').length,
    cancelled: appointments.filter(a => a.status === 'Cancelled').length
  };
}

// 1. GET /api/appointments (Server-side Search, Filtering, Sorting & Pagination)
app.get('/api/appointments', (req, res) => {
  try {
    let result = [...appointments];

    const { search, department, status, sortField, sortOrder, page = 1, pageSize = 10 } = req.query;

    // Backend Search (Patient Name, Doctor Name, Contact Number, ID)
    if (search && typeof search === 'string' && search.trim() !== '') {
      const term = search.toLowerCase().trim();
      result = result.filter(a =>
        a.patientName.toLowerCase().includes(term) ||
        a.doctorName.toLowerCase().includes(term) ||
        a.contactNumber.includes(term) ||
        a.id.toString().includes(term)
      );
    }

    // Backend Filtering (Department & Status)
    if (department && typeof department === 'string' && department !== 'null' && department !== '') {
      result = result.filter(a => a.department.toLowerCase() === department.toLowerCase());
    }

    if (status && typeof status === 'string' && status !== 'null' && status !== '') {
      result = result.filter(a => a.status.toLowerCase() === status.toLowerCase());
    }

    // Backend Sorting (Patient Name, Doctor Name, Department, Appointment Date, Status, etc.)
    if (sortField && typeof sortField === 'string') {
      const isAsc = sortOrder === 'asc';
      result.sort((a, b) => {
        const valA = (a[sortField] || '').toString().toLowerCase();
        const valB = (b[sortField] || '').toString().toLowerCase();
        if (valA < valB) return isAsc ? -1 : 1;
        if (valA > valB) return isAsc ? 1 : -1;
        return 0;
      });
    }

    // Server-side Pagination
    const totalRecords = result.length;
    const p = Math.max(1, parseInt(page) || 1);
    const limit = Math.max(1, parseInt(pageSize) || 10);
    const totalPages = Math.ceil(totalRecords / limit) || 1;

    const startIndex = (p - 1) * limit;
    const paginatedData = result.slice(startIndex, startIndex + limit);

    res.json({
      success: true,
      message: 'Appointments fetched successfully',
      data: paginatedData,
      pagination: {
        totalRecords,
        currentPage: p,
        pageSize: limit,
        totalPages
      },
      totalRecords,
      currentPage: p,
      totalPages,
      pageSize: limit,
      stats: getStats()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to process your request. Please try again later.'
    });
  }
});

// GET /api/appointments/:id (Get Single Record)
app.get('/api/appointments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const appointment = appointments.find(a => a.id === id);
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
});

// POST /api/appointments (Create Appointment & Auto ID Generation)
app.post('/api/appointments', (req, res) => {
  const { patientName, doctorName, department, appointmentDate, appointmentTime, contactNumber, status, description } = req.body;

  // Validation
  if (!patientName || !doctorName || !department || !appointmentDate || !appointmentTime || !contactNumber || !status) {
    return res.status(400).json({
      success: false,
      message: 'All required fields must be provided.'
    });
  }

  const newAppointment = {
    id: nextId++,
    patientName: patientName.trim(),
    doctorName: doctorName.trim(),
    department: department.trim(),
    appointmentDate,
    appointmentTime,
    contactNumber: contactNumber.trim(),
    status,
    description: description ? description.trim() : ''
  };

  appointments.unshift(newAppointment);

  res.status(201).json({
    success: true,
    message: 'Appointment created successfully',
    data: newAppointment,
    stats: getStats()
  });
});

// PUT /api/appointments/:id (Edit Appointment)
app.put('/api/appointments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = appointments.findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Appointment record not found'
    });
  }

  const { patientName, doctorName, department, appointmentDate, appointmentTime, contactNumber, status, description } = req.body;

  appointments[index] = {
    ...appointments[index],
    patientName: patientName ? patientName.trim() : appointments[index].patientName,
    doctorName: doctorName ? doctorName.trim() : appointments[index].doctorName,
    department: department ? department.trim() : appointments[index].department,
    appointmentDate: appointmentDate || appointments[index].appointmentDate,
    appointmentTime: appointmentTime || appointments[index].appointmentTime,
    contactNumber: contactNumber ? contactNumber.trim() : appointments[index].contactNumber,
    status: status || appointments[index].status,
    description: description !== undefined ? description.trim() : appointments[index].description
  };

  res.json({
    success: true,
    message: 'Appointment updated successfully',
    data: appointments[index],
    stats: getStats()
  });
});

// DELETE /api/appointments/:id (Delete Appointment)
app.delete('/api/appointments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = appointments.findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Appointment record not found'
    });
  }

  const deleted = appointments.splice(index, 1)[0];

  res.json({
    success: true,
    message: 'Appointment deleted successfully',
    data: deleted,
    stats: getStats()
  });
});

// GET /api/doctors (Doctors List)
app.get('/api/doctors', (req, res) => {
  res.json({
    success: true,
    message: 'Doctor list fetched successfully',
    data: doctors
  });
});

// Start Node.js Express Server
app.listen(PORT, () => {
  console.log(`Hospital Appointment System Node.js API server running on http://localhost:${PORT}`);
});
