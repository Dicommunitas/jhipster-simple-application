import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ITrabalho, Trabalho } from 'app/shared/model/trabalho.model';
import { TrabalhoService } from './trabalho.service';
import { TrabalhoComponent } from './trabalho.component';
import { TrabalhoDetailComponent } from './trabalho-detail.component';
import { TrabalhoUpdateComponent } from './trabalho-update.component';

@Injectable({ providedIn: 'root' })
export class TrabalhoResolve implements Resolve<ITrabalho> {
  constructor(private service: TrabalhoService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITrabalho> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((trabalho: HttpResponse<Trabalho>) => {
          if (trabalho.body) {
            return of(trabalho.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Trabalho());
  }
}

export const trabalhoRoute: Routes = [
  {
    path: '',
    component: TrabalhoComponent,
    data: {
      authorities: [Authority.USER],
      defaultSort: 'id,asc',
      pageTitle: 'jhipsterSampleApplicationApp.trabalho.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TrabalhoDetailComponent,
    resolve: {
      trabalho: TrabalhoResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'jhipsterSampleApplicationApp.trabalho.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TrabalhoUpdateComponent,
    resolve: {
      trabalho: TrabalhoResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'jhipsterSampleApplicationApp.trabalho.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TrabalhoUpdateComponent,
    resolve: {
      trabalho: TrabalhoResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'jhipsterSampleApplicationApp.trabalho.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
