import { Component, OnInit, HostListener, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Appointment } from '../../../../core/models/appointment.model';
import { AppointmentService } from '../../../../core/services/appointment.service';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    SelectModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './appointment-list.component.html',
})
export class AppointmentListComponent implements OnInit, OnDestroy {
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
  isTableUpdating: boolean = false;
  hasError: boolean = false;

  // Debounced Search Subject
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

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
    private route: ActivatedRoute,
    private appointmentService: AppointmentService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // Check navigation queryParams for success Toast notifications
    this.route.queryParams.subscribe(params => {
      if (params['added'] === 'true') {
        this.messageService.add({
          severity: 'success',
          summary: 'Appointment Saved!',
          detail: 'New appointment created successfully.',
          life: 3500
        });
      } else if (params['updated'] === 'true') {
        this.messageService.add({
          severity: 'success',
          summary: 'Appointment Updated!',
          detail: 'Appointment details updated successfully.',
          life: 3500
        });
      }
    });

    // 150ms Fast Debounced search execution for non-empty queries
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(150),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 1;
      this.loadAppointments(false);
    });

    this.loadAppointments(true);
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  // Load Appointments via API (Server-side Search, Filtering, Sorting & Pagination)
  loadAppointments(isInitial: boolean = false): void {
    if (isInitial) {
      this.isLoading = true;
    } else {
      this.isTableUpdating = true;
    }
    this.hasError = false;
    this.cdr.detectChanges();

    this.appointmentService.getAppointments({
      page: this.currentPage,
      pageSize: this.pageSize,
      search: this.searchTerm ? this.searchTerm.trim() : undefined,
      department: this.selectedDepartment || undefined,
      status: this.selectedStatus || undefined,
      sortField: this.sortField || undefined,
      sortOrder: this.sortOrder
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.isTableUpdating = false;
        this.appointments = res.data || [];
        this.totalRecords = res.totalRecords || 0;
        this.currentPage = res.currentPage || 1;
        this.totalPages = res.totalPages || 1;
        if (res.stats) {
          this.stats = res.stats;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.isTableUpdating = false;
        this.hasError = true;
        this.cdr.detectChanges();
      }
    });
  }

  onSearch(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      // Empty search term -> Immediately load full data (0ms delay)
      this.currentPage = 1;
      this.loadAppointments(false);
    } else {
      // Non-empty search term -> Fast 150ms debounce
      this.searchSubject.next(this.searchTerm);
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadAppointments(false);
    this.cdr.detectChanges();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadAppointments(false);
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadAppointments(false);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadAppointments(false);
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
    this.loadAppointments(false);
    this.cdr.detectChanges();
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
      const idToDelete = this.appointmentToDelete.id;
      // Optimistically remove from view immediately for instant response
      this.appointments = this.appointments.filter(a => a.id !== idToDelete);
      this.totalRecords = Math.max(0, this.totalRecords - 1);
      this.cdr.detectChanges();

      this.appointmentService.deleteAppointment(idToDelete).subscribe({
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
    this.cdr.detectChanges();
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
