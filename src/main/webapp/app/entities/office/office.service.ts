import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, SearchWithPagination } from 'app/shared/util/request-util';
import { IOffice } from 'app/shared/model/office.model';

type EntityResponseType = HttpResponse<IOffice>;
type EntityArrayResponseType = HttpResponse<IOffice[]>;

@Injectable({ providedIn: 'root' })
export class OfficeService {
  public resourceUrl = SERVER_API_URL + 'api/offices';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/offices';

  constructor(protected http: HttpClient) {}

  create(office: IOffice): Observable<EntityResponseType> {
    return this.http.post<IOffice>(this.resourceUrl, office, { observe: 'response' });
  }

  update(office: IOffice): Observable<EntityResponseType> {
    return this.http.put<IOffice>(this.resourceUrl, office, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOffice>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOffice[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOffice[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
