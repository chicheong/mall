import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, SearchWithPagination } from 'app/shared/util/request-util';
import { IQuantity } from 'app/shared/model/quantity.model';

type EntityResponseType = HttpResponse<IQuantity>;
type EntityArrayResponseType = HttpResponse<IQuantity[]>;

@Injectable({ providedIn: 'root' })
export class QuantityService {
  public resourceUrl = SERVER_API_URL + 'api/quantities';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/quantities';

  constructor(protected http: HttpClient) {}

  create(quantity: IQuantity): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(quantity);
    return this.http
      .post<IQuantity>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(quantity: IQuantity): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(quantity);
    return this.http
      .put<IQuantity>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IQuantity>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IQuantity[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IQuantity[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateFromClient(quantity: IQuantity): IQuantity {
    const copy: IQuantity = Object.assign({}, quantity, {
      from: quantity.from && quantity.from.isValid() ? quantity.from.toJSON() : undefined,
      to: quantity.to && quantity.to.isValid() ? quantity.to.toJSON() : undefined
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.from = res.body.from ? moment(res.body.from) : undefined;
      res.body.to = res.body.to ? moment(res.body.to) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((quantity: IQuantity) => {
        quantity.from = quantity.from ? moment(quantity.from) : undefined;
        quantity.to = quantity.to ? moment(quantity.to) : undefined;
      });
    }
    return res;
  }
}
