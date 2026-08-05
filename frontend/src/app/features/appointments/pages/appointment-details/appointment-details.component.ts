import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Appointment } from '../../../../core/models/appointment.model';
import { AppointmentService } from '../../../../core/services/appointment.service';

@Component({
  selector: 'app-appointment-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './appointment-details.component.html',
})
export class AppointmentDetailsComponent implements OnInit {
  appointment: Appointment | null = null;
  appointmentId!: number;
  isLoading = true;
  hasError = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.appointmentId = +idParam;
      this.fetchDetails(this.appointmentId);
    }
  }

  fetchDetails(id: number) {
    this.isLoading = true;
    this.hasError = false;

    this.appointmentService.getAppointmentById(id).subscribe({
      next: (res) => {
        this.appointment = res.data || res;
        this.isLoading = false;
      },
      error: (err) => {
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/appointments']);
  }

  editAppointment() {
    if (this.appointmentId) {
      this.router.navigate(['/appointments/edit', this.appointmentId]);
    }
  }

  getInitials(name: string): string {
    if (!name) return 'P';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }
}
