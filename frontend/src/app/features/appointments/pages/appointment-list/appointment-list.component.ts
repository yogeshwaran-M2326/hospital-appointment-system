import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { Appointment } from '../../../../core/models/appointment.model';
import { AppointmentService } from '../../../../core/services/appointment.service';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    SelectModule
  ],
  templateUrl: './appointment-list.component.html',
})
export class AppointmentListComponent implements OnInit {
  activeActionMenuId: number | null = null;
  appointments: Appointment[] = [];

  // Server-side Pagination & Sorting (Requirement 2.7 & 2.8)
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  totalPages: number = 1;
  pageSizeOptions = [
    { label: '5 per page', value: 5 },
    { label: '10 per page', value: 10 },
    { label: '20 per page', value: 20 }
  ];

  sortField: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  // Screen States (Screen 6, 7, 8)
  isLoading: boolean = false;
  hasError: boolean = false;

  // Screen 5: Delete Confirmation Modal State
  showDeleteModal: boolean = false;
  appointmentToDelete: Appointment | null = null;

  // Summary Stats
  stats = {
    total: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0
  };

  // Filter models
  searchTerm: string = '';
  selectedDepartment: string | null = null;
  selectedStatus: string | null = null;

  // Dropdown options
  departments = [
    { label: 'Cardiology', value: 'Cardiology' },
    { label: 'Neurology', value: 'Neurology' },
    { label: 'Orthopedics', value: 'Orthopedics' },
    { label: 'Pediatrics', value: 'Pediatrics' },
    { label: 'General Medicine', value: 'General Medicine' }
  ];

  statuses = [
    { label: 'Scheduled', value: 'Scheduled' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' }
  ];

  constructor(
    private router: Router,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  // Load Appointments via API (Server-side Search, Filtering, Sorting & Pagination)
  loadAppointments(): void {
    this.isLoading = true;
    this.hasError = false;

    this.appointmentService.getAppointments({
      page: this.currentPage,
      pageSize: this.pageSize,
      search: this.searchTerm,
      department: this.selectedDepartment || undefined,
      status: this.selectedStatus || undefined,
      sortField: this.sortField || undefined,
      sortOrder: this.sortOrder
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.appointments = res.data || [];
        this.totalRecords = res.totalRecords || 0;
        this.currentPage = res.currentPage || 1;
        this.totalPages = res.totalPages || 1;
        if (res.stats) {
          this.stats = res.stats;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.hasError = true;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadAppointments();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadAppointments();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadAppointments();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadAppointments();
    }
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedDepartment = null;
    this.selectedStatus = null;
    this.sortField = '';
    this.sortOrder = 'asc';
    this.currentPage = 1;
    this.hasError = false;
    this.loadAppointments();
  }

  retryFetch(): void {
    this.loadAppointments();
  }

  sortData(field: string): void {
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortOrder = 'asc';
    }
    this.loadAppointments();
  }

  addAppointment(): void {
    this.router.navigate(['/appointments/add']);
  }

  editAppointment(appointment: Appointment): void {
    this.router.navigate(['/appointments/edit', appointment.id]);
  }

  viewDetails(appointment: Appointment): void {
    this.router.navigate(['/appointments/view', appointment.id]);
  }

  // Action Dropdown Menu Methods
  toggleActionMenu(id: number | undefined, event: MouseEvent): void {
    event.stopPropagation();
    if (id === undefined) return;
    this.activeActionMenuId = this.activeActionMenuId === id ? null : id;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.activeActionMenuId = null;
  }

  // Screen 5: Delete Confirmation Popup
  openDeleteModal(appointment: Appointment, event: MouseEvent): void {
    event.stopPropagation();
    this.appointmentToDelete = appointment;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.appointmentToDelete = null;
  }

  confirmDelete(): void {
    if (this.appointmentToDelete && this.appointmentToDelete.id) {
      this.appointmentService.deleteAppointment(this.appointmentToDelete.id).subscribe({
        next: () => {
          this.loadAppointments();
        },
        error: () => {
          this.loadAppointments();
        }
      });
    }
    this.showDeleteModal = false;
    this.appointmentToDelete = null;
  }

  getInitials(name: string): string {
    if (!name) return 'P';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }

  getAvatarBg(id: number | undefined): string {
    const colors = [
      'bg-indigo-100 text-indigo-700 border-indigo-200',
      'bg-emerald-100 text-emerald-700 border-emerald-200',
      'bg-amber-100 text-amber-700 border-amber-200',
      'bg-purple-100 text-purple-700 border-purple-200',
      'bg-cyan-100 text-cyan-700 border-cyan-200'
    ];
    return colors[(id || 0) % colors.length];
  }
}
