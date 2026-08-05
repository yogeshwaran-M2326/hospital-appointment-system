// In-Memory Database Store with Clean Initial State

let appointments = [
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
