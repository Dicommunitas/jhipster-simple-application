import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IEmpregado, Empregado } from 'app/shared/model/empregado.model';
import { EmpregadoService } from './empregado.service';
import { EmpregadoComponent } from './empregado.component';
import { EmpregadoDetailComponent } from './empregado-detail.component';
import { EmpregadoUpdateComponent } from './empregado-update.component';

@Injectable({ providedIn: 'root' })
export class EmpregadoResolve implements Resolve<IEmpregado> {
  constructor(private service: EmpregadoService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEmpregado> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((empregado: HttpResponse<Empregado>) => {
          if (empregado.body) {
            return of(empregado.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Empregado());
  }
}

export const empregadoRoute: Routes = [
  {
    path: '',
    component: EmpregadoComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'jhipsterSampleApplicationApp.empregado.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EmpregadoDetailComponent,
    resolve: {
      empregado: EmpregadoResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'jhipsterSampleApplicationApp.empregado.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EmpregadoUpdateComponent,
    resolve: {
      empregado: EmpregadoResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'jhipsterSampleApplicationApp.empregado.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EmpregadoUpdateComponent,
    resolve: {
      empregado: EmpregadoResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'jhipsterSampleApplicationApp.empregado.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
