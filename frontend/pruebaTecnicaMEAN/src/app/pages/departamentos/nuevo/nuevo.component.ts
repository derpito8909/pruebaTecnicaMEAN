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

import { Departamento } from '../../../interfaces/departamento';
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
export class NuevoDepartamentoComponent implements OnInit, OnDestroy {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private activeRouter = inject(ActivatedRoute);

  private destroy$ = new Subject<void>();

  errorMessage: string | null = null;
  isEditMode = false;

  departamentId: string | null = this.activeRouter.snapshot.paramMap.get('id');

  departamentForm: FormGroup = this.createFormGroup();

  ngOnInit(): void {
    this.isEditMode = Boolean(this.departamentId);
    this.isEditMode ? this.loadDepartamentData() : '';
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      codigo_departamento: new FormControl(''),
      nombre: new FormControl(''),
    });
  }

  private getDepartamentData(): Departamento | null {
    return this.departamentForm.valid
      ? (this.departamentForm.value as Departamento)
      : null;
  }

  private loadDepartamentData(): void {
    this.apiService
      .getById<Departamento>('departamento', this.departamentId!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (deparmet) => {
          this.departamentForm.patchValue(deparmet);
        },
        error: (err) => this.handleError(err),
      });
  }
  onSubmit(): void {
    const deparmetData = this.getDepartamentData();
    if (deparmetData) {
      const request$ = this.isEditMode
        ? this.apiService.update<Departamento>(
            'departamento',
            this.departamentId!,
            deparmetData
          )
        : this.apiService.create<Departamento>('departamento', deparmetData);
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
    this.departamentForm.reset();
    this.router.navigate(['principal']);
  }
  private handleError(err: any): void {
    this.errorMessage = err.message;
  }
}
