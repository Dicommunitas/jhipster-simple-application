import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IEmpregado } from 'app/shared/model/empregado.model';

type EntityResponseType = HttpResponse<IEmpregado>;
type EntityArrayResponseType = HttpResponse<IEmpregado[]>;

@Injectable({ providedIn: 'root' })
export class EmpregadoService {
  public resourceUrl = SERVER_API_URL + 'api/empregados';

  constructor(protected http: HttpClient) {}

  create(empregado: IEmpregado): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(empregado);
    return this.http
      .post<IEmpregado>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(empregado: IEmpregado): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(empregado);
    return this.http
      .put<IEmpregado>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IEmpregado>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEmpregado[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(empregado: IEmpregado): IEmpregado {
    const copy: IEmpregado = Object.assign({}, empregado, {
      dataContratacao: empregado.dataContratacao && empregado.dataContratacao.isValid() ? empregado.dataContratacao.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dataContratacao = res.body.dataContratacao ? moment(res.body.dataContratacao) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((empregado: IEmpregado) => {
        empregado.dataContratacao = empregado.dataContratacao ? moment(empregado.dataContratacao) : undefined;
      });
    }
    return res;
  }
}
