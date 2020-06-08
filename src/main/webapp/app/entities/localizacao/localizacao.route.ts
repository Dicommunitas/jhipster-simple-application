import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ILocalizacao, Localizacao } from 'app/shared/model/localizacao.model';
import { LocalizacaoService } from './localizacao.service';
import { LocalizacaoComponent } from './localizacao.component';
import { LocalizacaoDetailComponent } from './localizacao-detail.component';
import { LocalizacaoUpdateComponent } from './localizacao-update.component';

@Injectable({ providedIn: 'root' })
export class LocalizacaoResolve implements Resolve<ILocalizacao> {
  constructor(private service: LocalizacaoService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILocalizacao> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((localizacao: HttpResponse<Localizacao>) => {
          if (localizacao.body) {
            return of(localizacao.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Localizacao());
  }
}

export const localizacaoRoute: Routes = [
  {
    path: '',
    component: LocalizacaoComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'jhipsterSampleApplicationApp.localizacao.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LocalizacaoDetailComponent,
    resolve: {
      localizacao: LocalizacaoResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'jhipsterSampleApplicationApp.localizacao.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LocalizacaoUpdateComponent,
    resolve: {
      localizacao: LocalizacaoResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'jhipsterSampleApplicationApp.localizacao.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LocalizacaoUpdateComponent,
    resolve: {
      localizacao: LocalizacaoResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'jhipsterSampleApplicationApp.localizacao.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
