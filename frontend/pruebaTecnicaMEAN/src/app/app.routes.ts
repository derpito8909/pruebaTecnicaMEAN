import { Routes } from '@angular/router';
import { EmpleadosComponent } from './pages/empleados/empleados.component';
import { NuevoComponent } from './pages/empleados/nuevo/nuevo.component';
import { DepartamentosComponent } from './pages/departamentos/departamentos.component';
import { NuevoDepartamentoComponent } from './pages/departamentos/nuevo/nuevo.component';

export const routes: Routes = [
  {
    path: 'principal',
    component: EmpleadosComponent,
  },
  {
    path: 'empleado/edit/:id',
    component: NuevoComponent,
  },
  {
    path: 'empleado/nuevo',
    component: NuevoComponent,
  },
  {
    path: 'departamento',
    component: DepartamentosComponent,
  },
  {
    path: 'departamento/nuevo',
    component: NuevoDepartamentoComponent,
  },
  {
    path: 'departamento/edit/:id',
    component: NuevoDepartamentoComponent,
  },
  {
    path: '',
    redirectTo: '/principal',
    pathMatch: 'full',
  },
];
