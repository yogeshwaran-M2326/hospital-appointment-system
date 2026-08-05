import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// PrimeNG Modules
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AppointmentService } from '../../../../core/services/appointment.service';

@Component({
  selector: 'app-add-appointment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    ButtonModule,
    CardModule,
    MessageModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './add-appointment.component.html',
})
export class AddAppointmentComponent implements OnInit {
  appointmentForm!: FormGroup;
  isSubmitting = false;

  departments = [
    { label: 'Cardiology', value: 'Cardiology' },
    { label: 'Neurology', value: 'Neurology' },
    { label: 'Orthopedics', value: 'Orthopedics' },
    { label: 'Pediatrics', value: 'Pediatrics' },
    { label: 'General Medicine', value: 'General Medicine' }
  ];

  doctors = [
    { label: 'Dr. Robert Kumar (Cardiology)', value: 'Dr. Robert Kumar' },
    { label: 'Dr. Emily Vance (Neurology)', value: 'Dr. Emily Vance' },
    { label: 'Dr. Gregory House (Orthopedics)', value: 'Dr. Gregory House' },
    { label: 'Dr. Sarah Connor (Pediatrics)', value: 'Dr. Sarah Connor' },
    { label: 'Dr. John Watson (General Medicine)', value: 'Dr. John Watson' }
  ];

  statuses = [
    { label: 'Scheduled', value: 'Scheduled' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' }
  ];

  times = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ].map(t => ({ label: t, value: t }));

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.appointmentForm = this.fb.group({
      patientName: ['', [Validators.required, Validators.minLength(2)]],
      doctorName: ['', [Validators.required]],
      department: ['', [Validators.required]],
      appointmentDate: [null, [Validators.required]],
      appointmentTime: ['', [Validators.required]],
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      status: ['Scheduled', [Validators.required]],
      description: ['']
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.appointmentForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.isSubmitting));
  }

  onSubmit(): void {
    this.isSubmitting = true;

    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill out all required fields correctly.'
      });
      this.isSubmitting = false;
      return;
    }

    const formValue = this.appointmentForm.value;
    
    // Format date string if Date object (Local Timezone YYYY-MM-DD)
    let formattedDate = formValue.appointmentDate;
    if (formValue.appointmentDate instanceof Date) {
      const d = formValue.appointmentDate;
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      formattedDate = `${year}-${month}-${day}`;
    }

    const newAppointment = {
      ...formValue,
      appointmentDate: formattedDate
    };

    this.appointmentService.createAppointment(newAppointment).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Appointment created successfully'
        });
        this.router.navigate(['/appointments']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to process your request. Please try again later.'
        });
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/appointments']);
  }
}
