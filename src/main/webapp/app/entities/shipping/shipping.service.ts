import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, SearchWithPagination } from 'app/shared/util/request-util';
import { IShipping } from 'app/shared/model/shipping.model';

type EntityResponseType = HttpResponse<IShipping>;
type EntityArrayResponseType = HttpResponse<IShipping[]>;

@Injectable({ providedIn: 'root' })
export class ShippingService {
  public resourceUrl = SERVER_API_URL + 'api/shippings';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/shippings';

  constructor(protected http: HttpClient) {}

  create(shipping: IShipping): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shipping);
    return this.http
      .post<IShipping>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(shipping: IShipping): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shipping);
    return this.http
      .put<IShipping>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IShipping>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IShipping[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IShipping[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateFromClient(shipping: IShipping): IShipping {
    const copy: IShipping = Object.assign({}, shipping, {
      date: shipping.date && shipping.date.isValid() ? shipping.date.toJSON() : undefined
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? moment(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((shipping: IShipping) => {
        shipping.date = shipping.date ? moment(shipping.date) : undefined;
      });
    }
    return res;
  }
}
