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

import { ApiService } from '../../services/api.service';
import { Departamento } from '../../interfaces/departamento';

@Component({
  selector: 'app-departamentos',
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
  templateUrl: './departamentos.component.html',
  styleUrl: './departamentos.component.css',
})
export class DepartamentosComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  private apiService = inject(ApiService);
  private router = inject(Router);

  private destroy$ = new Subject<void>();

  errorMessage: string | null = null;
  Alldepartmet: Departamento[] = [];
  displayedColumns: string[] = [
    'codigo_departamento',
    'nombre',
    'edit',
    'delete',
  ];
  dataSource = new MatTableDataSource<Departamento>([]);
  //logica de paginacion
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  ngOnInit(): void {
    this.getAllDepartaments();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAllDepartaments(): void {
    this.apiService
      .getAll<Departamento>('departamento')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (departament) => {
          if (departament) {
            this.Alldepartmet = departament;
            this.dataSource = new MatTableDataSource(departament);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        },
        error: (err) => {
          this.errorMessage = err.message;
        },
      });
  }

  addDepartament(): void {
    this.router.navigate([`/departamento/nuevo/`]);
  }

  editDepartament(id: string) {
    this.router.navigate([`/departamento/edit/${id}`]);
  }
  deleteDeparment(id: string): void {
    this.apiService
      .delete('departamento', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.getAllDepartaments();
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
