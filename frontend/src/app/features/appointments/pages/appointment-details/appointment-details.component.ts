import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    private appointmentService: AppointmentService,
    private cdr: ChangeDetectorRef
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
    this.cdr.detectChanges();

    this.appointmentService.getAppointmentById(id).subscribe({
      next: (res) => {
        this.appointment = res.data || res;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.hasError = true;
        this.isLoading = false;
        this.cdr.detectChanges();
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

  formatTime(time: string): string {
    if (!time) return '';
    if (time.includes('AM') || time.includes('PM')) return time;
    
    const [hourStr, minStr] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    const paddedHour = hour < 10 ? '0' + hour : hour.toString();
    return `${paddedHour}:${minStr} ${ampm}`;
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
