export interface Appointment {
    id?: number;
    patientName: string;
    doctorName: string;
    department: string;
    appointmentDate: string;
    appointmentTime: string;
    contactNumber: string;
    status: 'Scheduled' | 'Completed' | 'Cancelled' | string;
    description?: string;
}
