import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, SearchWithPagination } from 'app/shared/util/request-util';
import { IDelegation } from 'app/shared/model/delegation.model';

type EntityResponseType = HttpResponse<IDelegation>;
type EntityArrayResponseType = HttpResponse<IDelegation[]>;

@Injectable({ providedIn: 'root' })
export class DelegationService {
  public resourceUrl = SERVER_API_URL + 'api/delegations';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/delegations';

  constructor(protected http: HttpClient) {}

  create(delegation: IDelegation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(delegation);
    return this.http
      .post<IDelegation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(delegation: IDelegation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(delegation);
    return this.http
      .put<IDelegation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IDelegation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDelegation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDelegation[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateFromClient(delegation: IDelegation): IDelegation {
    const copy: IDelegation = Object.assign({}, delegation, {
      from: delegation.from && delegation.from.isValid() ? delegation.from.toJSON() : undefined,
      to: delegation.to && delegation.to.isValid() ? delegation.to.toJSON() : undefined,
      createdDate: delegation.createdDate && delegation.createdDate.isValid() ? delegation.createdDate.toJSON() : undefined,
      lastModifiedDate:
        delegation.lastModifiedDate && delegation.lastModifiedDate.isValid() ? delegation.lastModifiedDate.toJSON() : undefined
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.from = res.body.from ? moment(res.body.from) : undefined;
      res.body.to = res.body.to ? moment(res.body.to) : undefined;
      res.body.createdDate = res.body.createdDate ? moment(res.body.createdDate) : undefined;
      res.body.lastModifiedDate = res.body.lastModifiedDate ? moment(res.body.lastModifiedDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((delegation: IDelegation) => {
        delegation.from = delegation.from ? moment(delegation.from) : undefined;
        delegation.to = delegation.to ? moment(delegation.to) : undefined;
        delegation.createdDate = delegation.createdDate ? moment(delegation.createdDate) : undefined;
        delegation.lastModifiedDate = delegation.lastModifiedDate ? moment(delegation.lastModifiedDate) : undefined;
      });
    }
    return res;
  }
}
