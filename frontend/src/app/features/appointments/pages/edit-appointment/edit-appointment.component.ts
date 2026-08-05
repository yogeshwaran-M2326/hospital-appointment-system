import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@Component({
  selector: 'app-edit-appointment',
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
    ToastModule,
    NgxMaterialTimepickerModule
  ],
  providers: [MessageService],
  templateUrl: './edit-appointment.component.html',
})
export class EditAppointmentComponent implements OnInit {
  appointmentForm!: FormGroup;
  appointmentId!: number;
  isSubmitting = false;

  timepickerTheme = {
    container: {
        bodyBackgroundColor: '#ffffff',
        buttonColor: '#3b82f6'
    },
    dial: {
        dialBackgroundColor: '#3b82f6',
    },
    clockFace: {
        clockFaceBackgroundColor: '#f1f5f9',
        clockHandColor: '#3b82f6',
        clockFaceTimeInactiveColor: '#475569'
    }
  };

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
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'
  ].map(t => ({ label: t, value: t }));

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.initForm();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.appointmentId = +idParam;
      this.loadAppointmentData(this.appointmentId);
    }
  }

  initForm(): void {
    this.appointmentForm = this.fb.group({
      patientName: ['', [Validators.required, Validators.minLength(2)]],
      doctorName: ['', [Validators.required]],
      department: ['', [Validators.required]],
      appointmentDate: [null, [Validators.required]],
      appointmentTime: [null, [Validators.required]],
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      status: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  loadAppointmentData(id: number): void {
    this.appointmentService.getAppointmentById(id).subscribe({
      next: (existing) => {
        let dateObj: Date | null = null;
        if (existing.appointmentDate) {
          dateObj = new Date(existing.appointmentDate);
        }

        this.appointmentForm.patchValue({
          patientName: existing.patientName,
          doctorName: existing.doctorName,
          department: existing.department,
          appointmentDate: dateObj || existing.appointmentDate,
          appointmentTime: existing.appointmentTime,
          contactNumber: existing.contactNumber,
          status: existing.status,
          description: existing.description || ''
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to load appointment details.'
        });
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.appointmentForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.isSubmitting));
  }

  onInputCapitalize(fieldName: string): void {
    const value = this.appointmentForm.get(fieldName)?.value;
    if (value && typeof value === 'string') {
      const capitalized = value.replace(/\b\w/g, (char: string) => char.toUpperCase());
      if (value !== capitalized) {
        this.appointmentForm.get(fieldName)?.setValue(capitalized, { emitEvent: false });
      }
    }
  }

  onlyNumbers(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  onNumberInput(event: Event, fieldName: string): void {
    const input = event.target as HTMLInputElement;
    const sanitized = input.value.replace(/[^0-9]/g, '');
    if (input.value !== sanitized) {
      input.value = sanitized;
    }
    this.appointmentForm.get(fieldName)?.setValue(sanitized, { emitEvent: false });
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
    
    const patientName = formValue.patientName ? formValue.patientName.trim().replace(/\b\w/g, (c: string) => c.toUpperCase()) : '';
    const description = formValue.description ? formValue.description.trim().replace(/\b\w/g, (c: string) => c.toUpperCase()) : '';

    let formattedDate = formValue.appointmentDate;
    if (formValue.appointmentDate instanceof Date) {
      const d = formValue.appointmentDate;
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      formattedDate = `${year}-${month}-${day}`;
    }

    let formattedTime = formValue.appointmentTime;
    if (formValue.appointmentTime instanceof Date) {
      const d = formValue.appointmentTime;
      let h = d.getHours();
      let m = String(d.getMinutes()).padStart(2, '0');
      let ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12;
      h = h ? h : 12; // the hour '0' should be '12'
      formattedTime = `${String(h).padStart(2, '0')}:${m} ${ampm}`;
    }

    const updatedAppointment = {
      ...formValue,
      patientName,
      description,
      appointmentDate: formattedDate,
      appointmentTime: formattedTime
    };

    this.appointmentService.updateAppointment(this.appointmentId, updatedAppointment).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: '✨ Appointment Updated Successfully!',
          detail: `Record details for ${patientName} updated successfully.`,
          life: 4000
        });
        setTimeout(() => {
          this.router.navigate(['/appointments'], { queryParams: { updated: 'true', name: patientName } });
        }, 1100);
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
