import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IHistoricoDeTrabalho } from 'app/shared/model/historico-de-trabalho.model';

type EntityResponseType = HttpResponse<IHistoricoDeTrabalho>;
type EntityArrayResponseType = HttpResponse<IHistoricoDeTrabalho[]>;

@Injectable({ providedIn: 'root' })
export class HistoricoDeTrabalhoService {
  public resourceUrl = SERVER_API_URL + 'api/historico-de-trabalhos';

  constructor(protected http: HttpClient) {}

  create(historicoDeTrabalho: IHistoricoDeTrabalho): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(historicoDeTrabalho);
    return this.http
      .post<IHistoricoDeTrabalho>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(historicoDeTrabalho: IHistoricoDeTrabalho): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(historicoDeTrabalho);
    return this.http
      .put<IHistoricoDeTrabalho>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IHistoricoDeTrabalho>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IHistoricoDeTrabalho[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(historicoDeTrabalho: IHistoricoDeTrabalho): IHistoricoDeTrabalho {
    const copy: IHistoricoDeTrabalho = Object.assign({}, historicoDeTrabalho, {
      dataInicial:
        historicoDeTrabalho.dataInicial && historicoDeTrabalho.dataInicial.isValid() ? historicoDeTrabalho.dataInicial.toJSON() : undefined,
      dataFinal:
        historicoDeTrabalho.dataFinal && historicoDeTrabalho.dataFinal.isValid() ? historicoDeTrabalho.dataFinal.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dataInicial = res.body.dataInicial ? moment(res.body.dataInicial) : undefined;
      res.body.dataFinal = res.body.dataFinal ? moment(res.body.dataFinal) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((historicoDeTrabalho: IHistoricoDeTrabalho) => {
        historicoDeTrabalho.dataInicial = historicoDeTrabalho.dataInicial ? moment(historicoDeTrabalho.dataInicial) : undefined;
        historicoDeTrabalho.dataFinal = historicoDeTrabalho.dataFinal ? moment(historicoDeTrabalho.dataFinal) : undefined;
      });
    }
    return res;
  }
}
