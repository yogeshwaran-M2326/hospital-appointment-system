const { appointments, getNextId, getStats } = require('../config/db.config');

class AppointmentService {
  /**
   * Get paginated, searched, filtered, and sorted appointment list
   */
  getAllAppointments(queryParams) {
    let result = [...appointments];

    const { search, department, status, sortField, sortOrder, page = 1, pageSize = 10 } = queryParams;

    // 1. Search
    if (search && typeof search === 'string' && search.trim() !== '') {
      const term = search.toLowerCase().trim();
      result = result.filter(a =>
        a.patientName.toLowerCase().includes(term) ||
        a.doctorName.toLowerCase().includes(term) ||
        a.contactNumber.includes(term) ||
        a.id.toString().includes(term)
      );
    }

    // 2. Department Filter
    if (department && typeof department === 'string' && department !== 'null' && department !== '') {
      result = result.filter(a => a.department.toLowerCase() === department.toLowerCase());
    }

    // 3. Status Filter
    if (status && typeof status === 'string' && status !== 'null' && status !== '') {
      result = result.filter(a => a.status.toLowerCase() === status.toLowerCase());
    }

    // 4. Sorting
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

    // 5. Server-side Pagination
    const totalRecords = result.length;
    const p = Math.max(1, parseInt(page) || 1);
    const limit = Math.max(1, parseInt(pageSize) || 10);
    const totalPages = Math.ceil(totalRecords / limit) || 1;

    const startIndex = (p - 1) * limit;
    const paginatedData = result.slice(startIndex, startIndex + limit);

    return {
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
    };
  }

  /**
   * Get single appointment by ID
   */
  getAppointmentById(id) {
    const numericId = parseInt(id);
    return appointments.find(a => a.id === numericId) || null;
  }

  /**
   * Create new appointment
   */
  createAppointment(payload) {
    const { patientName, doctorName, department, appointmentDate, appointmentTime, contactNumber, status, description } = payload;

    const newAppointment = {
      id: getNextId(),
      patientName: patientName.trim(),
      doctorName: doctorName.trim(),
      department: department.trim(),
      appointmentDate,
      appointmentTime,
      contactNumber: contactNumber.trim(),
      status: status || 'Scheduled',
      description: description ? description.trim() : ''
    };

    appointments.unshift(newAppointment);

    return {
      data: newAppointment,
      stats: getStats()
    };
  }

  /**
   * Update appointment by ID
   */
  updateAppointment(id, payload) {
    const numericId = parseInt(id);
    const index = appointments.findIndex(a => a.id === numericId);

    if (index === -1) {
      return null;
    }

    const { patientName, doctorName, department, appointmentDate, appointmentTime, contactNumber, status, description } = payload;

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

    return {
      data: appointments[index],
      stats: getStats()
    };
  }

  /**
   * Delete appointment by ID
   */
  deleteAppointment(id) {
    const numericId = parseInt(id);
    const index = appointments.findIndex(a => a.id === numericId);

    if (index === -1) {
      return null;
    }

    const deleted = appointments.splice(index, 1)[0];

    return {
      data: deleted,
      stats: getStats()
    };
  }
}

module.exports = new AppointmentService();
