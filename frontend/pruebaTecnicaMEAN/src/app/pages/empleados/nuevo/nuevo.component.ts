import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule, DatePipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
//importaciones internas

import { Empleado } from '../../../interfaces/empleado';
import { ApiService } from '../../../services/api.service';
@Component({
  selector: 'app-nuevo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    RouterLink,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './nuevo.component.html',
  styleUrl: './nuevo.component.css',
})
export class NuevoComponent implements OnInit, OnDestroy {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private activeRouter = inject(ActivatedRoute);

  private destroy$ = new Subject<void>();

  errorMessage: string | null = null;
  isEditMode = false;

  employeId: string | null = this.activeRouter.snapshot.paramMap.get('id');

  employeForm: FormGroup = this.createFormGroup();

  ngOnInit(): void {
    this.isEditMode = Boolean(this.employeId);
    this.isEditMode ? this.loadEmployeData() : '';
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      codigo: new FormControl(''),
      nombre: new FormControl(''),
      apellido1: new FormControl(''),
      apellido2: new FormControl(''),
      codigo_departamento: new FormControl(''),
    });
  }

  private getEmployeData(): Empleado | null {
    return this.employeForm.valid ? (this.employeForm.value as Empleado) : null;
  }

  private loadEmployeData(): void {
    this.apiService
      .getById<Empleado>('empleado', this.employeId!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (employe) => {
          this.employeForm.patchValue(employe);
        },
        error: (err) => this.handleError(err),
      });
  }
  onSubmit(): void {
    const employeData = this.getEmployeData();
    if (employeData) {
      const request$ = this.isEditMode
        ? this.apiService.update<Empleado>(
            'empleado',
            this.employeId!,
            employeData
          )
        : this.apiService.create<Empleado>('empleado', employeData);
      request$.pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => {
          this.handleSuccess(res);
        },
        error: (err) => {
          this.handleError(err);
        },
      });
    }
  }

  private handleSuccess(res: any): void {
    this.employeForm.reset();
    this.router.navigate(['principal']);
  }
  private handleError(err: any): void {
    this.errorMessage = err.message;
  }
}
