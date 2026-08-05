# 🏥 Hospital Appointment Management System

A full-stack, enterprise-grade **Hospital Appointment Management System** built with **Angular (v19)**, **Node.js (Express)**, and **RESTful API Architecture**.

---

## 🚀 Key Features & Full Compliance Matrix

| Requirement Area | Functionality Implemented |
|---|---|
| **View Appointments** | Full tabular display with ID (`#101`, `#102`), Patient Name, Doctor Name, Department, Date, Time, Contact, and Status pills. |
| **Add Appointment** | Interactive form with reactive validation, auto-generated unique ID (`#113`, `#114`...), and toast notification `"Appointment created successfully"`. |
| **Edit Appointment** | Real-time API data pre-loading by ID, form validation, and toast notification `"Appointment updated successfully"`. |
| **Delete Appointment** | Modal confirmation dialog (`Are you sure you want to delete?`), API deletion, and automatic table refresh. |
| **Backend Search** | Real-time server-side search across Patient Name, Doctor Name, Contact Number, and Appointment ID. |
| **Backend Filtering** | Department (Cardiology, Neurology, Orthopedics, Pediatrics, General Medicine) & Status (Scheduled, Completed, Cancelled) filtering. |
| **Backend Sorting** | Server-side multi-column sorting (Ascending / Descending) on Patient Name, Doctor Name, Department, Date, and Status. |
| **Server-Side Pagination** | Dynamic page sizes (`5`, `10`, `20` records per page), Prev/Next controls, total records count, and page indicators (`Page X of Y`). |
| **UI Screen States** | Full coverage for Loading State (`Loading appointments...`), Empty State (`No appointment records found`), and Error State (`Unable to process your request`). |

---

## 🛠️ Technology Stack

- **Frontend**: Angular 19 (Standalone Components, Reactive Forms, PrimeNG `p-select` & `p-datepicker`, Tailwind CSS v4)
- **Backend**: Node.js, Express.js REST API
- **Database**: In-Memory Data Engine & Seed Data Store with Auto-incrementing ID Generator (`#101` to `#112` seed data)

---

## 📡 REST API Endpoints Documentation

| Method | Endpoint | Description | Query Parameters / Payload |
|---|---|---|---|
| `GET` | `/api/appointments` | Fetch paginated, filtered, searched, and sorted appointments | `search`, `department`, `status`, `sortField`, `sortOrder`, `page`, `pageSize` |
| `GET` | `/api/appointments/:id` | Fetch single appointment details by ID | `:id` (number) |
| `POST` | `/api/appointments` | Create a new appointment | `{ patientName, doctorName, department, appointmentDate, appointmentTime, contactNumber, status, description }` |
| `PUT` | `/api/appointments/:id` | Edit/Update existing appointment | Payload JSON object with updated fields |
| `DELETE` | `/api/appointments/:id` | Delete an appointment record | `:id` (number) |
| `GET` | `/api/doctors` | Fetch available doctors list | None |

---

## 🏃 Setup & Running Instructions

### 1. Start the Node.js API Backend
```bash
cd backend
npm install
node server.js
```
*Backend API server runs on:* `https://hospital-appointment-backend.onrender.com/api`

### 2. Start the Angular Frontend Application
```bash
cd frontend
npm install
npm run dev
```
*Frontend Application runs on:* `http://localhost:4200`

---

## 🧪 Unit Testing & Verification

Run unit tests using Angular CLI:
```bash
cd frontend
npm test
```
- Component Spec Tests (`appointment-list.component.spec.ts`)
- Service API Integration Tests (`appointment.service.spec.ts`)
