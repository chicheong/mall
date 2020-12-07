import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, SearchWithPagination } from 'app/shared/util/request-util';
import { IMyState } from 'app/shared/model/my-state.model';

type EntityResponseType = HttpResponse<IMyState>;
type EntityArrayResponseType = HttpResponse<IMyState[]>;

@Injectable({ providedIn: 'root' })
export class MyStateService {
  public resourceUrl = SERVER_API_URL + 'api/my-states';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/my-states';

  constructor(protected http: HttpClient) {}

  create(myState: IMyState): Observable<EntityResponseType> {
    return this.http.post<IMyState>(this.resourceUrl, myState, { observe: 'response' });
  }

  update(myState: IMyState): Observable<EntityResponseType> {
    return this.http.put<IMyState>(this.resourceUrl, myState, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMyState>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMyState[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMyState[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
