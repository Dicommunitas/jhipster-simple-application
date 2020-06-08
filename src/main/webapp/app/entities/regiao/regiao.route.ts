import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IRegiao, Regiao } from 'app/shared/model/regiao.model';
import { RegiaoService } from './regiao.service';
import { RegiaoComponent } from './regiao.component';
import { RegiaoDetailComponent } from './regiao-detail.component';
import { RegiaoUpdateComponent } from './regiao-update.component';

@Injectable({ providedIn: 'root' })
export class RegiaoResolve implements Resolve<IRegiao> {
  constructor(private service: RegiaoService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRegiao> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((regiao: HttpResponse<Regiao>) => {
          if (regiao.body) {
            return of(regiao.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Regiao());
  }
}

export const regiaoRoute: Routes = [
  {
    path: '',
    component: RegiaoComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'jhipsterSampleApplicationApp.regiao.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RegiaoDetailComponent,
    resolve: {
      regiao: RegiaoResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'jhipsterSampleApplicationApp.regiao.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RegiaoUpdateComponent,
    resolve: {
      regiao: RegiaoResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'jhipsterSampleApplicationApp.regiao.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RegiaoUpdateComponent,
    resolve: {
      regiao: RegiaoResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'jhipsterSampleApplicationApp.regiao.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
