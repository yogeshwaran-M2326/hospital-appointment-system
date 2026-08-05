const dbConfig = require('../config/db.config');
const AppointmentModel = require('../models/appointment.model');

class AppointmentService {
  async getAllAppointments(queryParams) {
    if (dbConfig.isMongoConnected()) {
      try {
        const { search, department, status, sortField, sortOrder, page = 1, pageSize = 10 } = queryParams;

        let filter = {};

        if (search && typeof search === 'string' && search.trim() !== '') {
          const term = search.toLowerCase().trim();
          filter.$or = [
            { patientName: { $regex: term, $options: 'i' } },
            { doctorName: { $regex: term, $options: 'i' } },
            { contactNumber: { $regex: term, $options: 'i' } }
          ];
          if (!isNaN(term)) {
            filter.$or.push({ id: Number(term) });
          }
        }

        if (department && typeof department === 'string' && department !== 'null' && department !== '') {
          filter.department = { $regex: `^${department}$`, $options: 'i' };
        }

        if (status && typeof status === 'string' && status !== 'null' && status !== '') {
          filter.status = { $regex: `^${status}$`, $options: 'i' };
        }

        let sortOption = { id: -1 }; // Default newest first
        if (sortField && typeof sortField === 'string') {
          const order = sortOrder === 'asc' ? 1 : -1;
          sortOption = { [sortField]: order };
        }

        const p = Math.max(1, parseInt(page) || 1);
        const limit = Math.max(1, parseInt(pageSize) || 10);
        const skip = (p - 1) * limit;

        const [data, totalRecords, allAppointments] = await Promise.all([
          AppointmentModel.find(filter).sort(sortOption).skip(skip).limit(limit).lean(),
          AppointmentModel.countDocuments(filter),
          AppointmentModel.find({}).lean()
        ]);

        const totalPages = Math.ceil(totalRecords / limit) || 1;

        return {
          data,
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
          stats: dbConfig.getStatsFromList(allAppointments)
        };
      } catch (err) {
        console.error('[MongoDB Error]: Error in getAllAppointments.', err);
        throw new Error('Database query failed: ' + err.message);
      }
    }

    let result = [...dbConfig.inMemoryAppointments];
    const { search, department, status, sortField, sortOrder, page = 1, pageSize = 10 } = queryParams;

    if (search && typeof search === 'string' && search.trim() !== '') {
      const term = search.toLowerCase().trim();
      result = result.filter(a =>
        a.patientName.toLowerCase().includes(term) ||
        a.doctorName.toLowerCase().includes(term) ||
        a.contactNumber.includes(term) ||
        a.id.toString().includes(term)
      );
    }

    if (department && typeof department === 'string' && department !== 'null' && department !== '') {
      result = result.filter(a => a.department.toLowerCase() === department.toLowerCase());
    }

    if (status && typeof status === 'string' && status !== 'null' && status !== '') {
      result = result.filter(a => a.status.toLowerCase() === status.toLowerCase());
    }

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
      stats: dbConfig.getStatsFromList(dbConfig.inMemoryAppointments)
    };
  }

  async getAppointmentById(id) {
    const numericId = parseInt(id);
    if (dbConfig.isMongoConnected()) {
      try {
        const doc = await AppointmentModel.findOne({ id: numericId }).lean();
        if (doc) return doc;
      } catch (err) {
        console.error('[MongoDB Error]: Error in getAppointmentById.', err);
        throw new Error('Database query failed: ' + err.message);
      }
    }
    return dbConfig.inMemoryAppointments.find(a => a.id === numericId) || null;
  }

  async createAppointment(payload) {
    const { patientName, doctorName, department, appointmentDate, appointmentTime, contactNumber, status, description } = payload;

    let nextId = dbConfig.getNextId();

    if (dbConfig.isMongoConnected()) {
      try {
        const maxDoc = await AppointmentModel.findOne({}).sort({ id: -1 }).lean();
        if (maxDoc && maxDoc.id) {
          nextId = maxDoc.id + 1;
        }
      } catch (err) {
        console.error('[MongoDB Error]: Error calculating max ID.', err);
      }
    }

    const newAppointment = {
      id: nextId,
      patientName: patientName.trim(),
      doctorName: doctorName.trim(),
      department: department.trim(),
      appointmentDate,
      appointmentTime,
      contactNumber: contactNumber.trim(),
      status: status || 'Scheduled',
      description: description ? description.trim() : ''
    };

    if (dbConfig.isMongoConnected()) {
      try {
        const createdDoc = await AppointmentModel.create(newAppointment);
        const allAppointments = await AppointmentModel.find({}).lean();
        return {
          data: createdDoc.toObject(),
          stats: dbConfig.getStatsFromList(allAppointments)
        };
      } catch (err) {
        console.error('[MongoDB Error]: Error creating document in MongoDB.', err);
        throw new Error('Database create failed: ' + err.message);
      }
    }

    dbConfig.inMemoryAppointments.unshift(newAppointment);

    return {
      data: newAppointment,
      stats: dbConfig.getStatsFromList(dbConfig.inMemoryAppointments)
    };
  }

  async updateAppointment(id, payload) {
    const numericId = parseInt(id);

    if (dbConfig.isMongoConnected()) {
      try {
        const updatedDoc = await AppointmentModel.findOneAndUpdate(
          { id: numericId },
          { $set: payload },
          { new: true, runValidators: true }
        ).lean();

        if (updatedDoc) {
          const allAppointments = await AppointmentModel.find({}).lean();
          return {
            data: updatedDoc,
            stats: dbConfig.getStatsFromList(allAppointments)
          };
        }
      } catch (err) {
        console.error('[MongoDB Error]: Error updating document in MongoDB.', err);
        throw new Error('Database update failed: ' + err.message);
      }
    }

    const index = dbConfig.inMemoryAppointments.findIndex(a => a.id === numericId);
    if (index === -1) return null;

    dbConfig.inMemoryAppointments[index] = {
      ...dbConfig.inMemoryAppointments[index],
      ...payload
    };

    return {
      data: dbConfig.inMemoryAppointments[index],
      stats: dbConfig.getStatsFromList(dbConfig.inMemoryAppointments)
    };
  }

  async deleteAppointment(id) {
    const numericId = parseInt(id);

    if (dbConfig.isMongoConnected()) {
      try {
        const deletedDoc = await AppointmentModel.findOneAndDelete({ id: numericId }).lean();
        if (deletedDoc) {
          const allAppointments = await AppointmentModel.find({}).lean();
          return {
            data: deletedDoc,
            stats: dbConfig.getStatsFromList(allAppointments)
          };
        }
      } catch (err) {
        console.error('[MongoDB Error]: Error deleting document in MongoDB.', err);
        throw new Error('Database delete failed: ' + err.message);
      }
    }

    const index = dbConfig.inMemoryAppointments.findIndex(a => a.id === numericId);
    if (index === -1) return null;

    const deleted = dbConfig.inMemoryAppointments.splice(index, 1)[0];

    return {
      data: deleted,
      stats: dbConfig.getStatsFromList(dbConfig.inMemoryAppointments)
    };
  }
}

module.exports = new AppointmentService();
