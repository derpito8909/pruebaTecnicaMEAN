//importaciones externas
import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
// importaciones internas
import { ApiService } from '../../services/api.service';
import { Empleado } from '../../interfaces/empleado';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
  ],
  templateUrl: './empleados.component.html',
  styleUrl: './empleados.component.css',
})
export class EmpleadosComponent implements OnInit, OnDestroy, AfterViewInit {
  private apiService = inject(ApiService);
  private router = inject(Router);

  private destroy$ = new Subject<void>();

  errorMessage: string | null = null;
  AllEmployes: Empleado[] = [];
  displayedColumns: string[] = [
    'codigo',
    'nombre',
    'apellido1',
    'apellido2',
    'codigo_departamento',
    'edit',
    'delete',
  ];
  dataSource = new MatTableDataSource<Empleado>([]);
  //logica de paginacion
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  ngOnInit(): void {
    this.getAllEmployes();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAllEmployes(): void {
    this.apiService
      .getAll<Empleado>('empleado')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (employes) => {
          if (employes) {
            this.AllEmployes = employes;
            this.dataSource = new MatTableDataSource(employes);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        },
        error: (err) => {
          this.errorMessage = err.message;
        },
      });
  }

  addEmploye(): void {
    this.router.navigate([`/empleado/nuevo/`]);
  }

  showDepartament(): void {
    this.router.navigate([`/departamento/`]);
  }

  editEmploye(id: string) {
    this.router.navigate([`/empleado/edit/${id}`]);
  }
  deleteEmploye(id: string): void {
    this.apiService
      .delete('empleado', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.getAllEmployes();
        },
        error: (err) => {
          this.errorMessage = err.message;
        },
      });
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
