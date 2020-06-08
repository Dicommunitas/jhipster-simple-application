import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IHistoricoDeTrabalho, HistoricoDeTrabalho } from 'app/shared/model/historico-de-trabalho.model';
import { HistoricoDeTrabalhoService } from './historico-de-trabalho.service';
import { HistoricoDeTrabalhoComponent } from './historico-de-trabalho.component';
import { HistoricoDeTrabalhoDetailComponent } from './historico-de-trabalho-detail.component';
import { HistoricoDeTrabalhoUpdateComponent } from './historico-de-trabalho-update.component';

@Injectable({ providedIn: 'root' })
export class HistoricoDeTrabalhoResolve implements Resolve<IHistoricoDeTrabalho> {
  constructor(private service: HistoricoDeTrabalhoService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IHistoricoDeTrabalho> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((historicoDeTrabalho: HttpResponse<HistoricoDeTrabalho>) => {
          if (historicoDeTrabalho.body) {
            return of(historicoDeTrabalho.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new HistoricoDeTrabalho());
  }
}

export const historicoDeTrabalhoRoute: Routes = [
  {
    path: '',
    component: HistoricoDeTrabalhoComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'jhipsterSampleApplicationApp.historicoDeTrabalho.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: HistoricoDeTrabalhoDetailComponent,
    resolve: {
      historicoDeTrabalho: HistoricoDeTrabalhoResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'jhipsterSampleApplicationApp.historicoDeTrabalho.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: HistoricoDeTrabalhoUpdateComponent,
    resolve: {
      historicoDeTrabalho: HistoricoDeTrabalhoResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'jhipsterSampleApplicationApp.historicoDeTrabalho.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: HistoricoDeTrabalhoUpdateComponent,
    resolve: {
      historicoDeTrabalho: HistoricoDeTrabalhoResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'jhipsterSampleApplicationApp.historicoDeTrabalho.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
