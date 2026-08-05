// In-Memory Database Store with Seed Data & Initial State

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

function getStats() {
  return {
    total: appointments.length,
    scheduled: appointments.filter(a => a.status === 'Scheduled').length,
    completed: appointments.filter(a => a.status === 'Completed').length,
    cancelled: appointments.filter(a => a.status === 'Cancelled').length
  };
}

module.exports = {
  appointments,
  doctors,
  getNextId: () => nextId++,
  getStats
};
