import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ITrabalho } from 'app/shared/model/trabalho.model';

type EntityResponseType = HttpResponse<ITrabalho>;
type EntityArrayResponseType = HttpResponse<ITrabalho[]>;

@Injectable({ providedIn: 'root' })
export class TrabalhoService {
  public resourceUrl = SERVER_API_URL + 'api/trabalhos';

  constructor(protected http: HttpClient) {}

  create(trabalho: ITrabalho): Observable<EntityResponseType> {
    return this.http.post<ITrabalho>(this.resourceUrl, trabalho, { observe: 'response' });
  }

  update(trabalho: ITrabalho): Observable<EntityResponseType> {
    return this.http.put<ITrabalho>(this.resourceUrl, trabalho, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITrabalho>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITrabalho[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
