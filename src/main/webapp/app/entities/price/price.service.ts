import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, SearchWithPagination } from 'app/shared/util/request-util';
import { IPrice } from 'app/shared/model/price.model';

type EntityResponseType = HttpResponse<IPrice>;
type EntityArrayResponseType = HttpResponse<IPrice[]>;

@Injectable({ providedIn: 'root' })
export class PriceService {
  public resourceUrl = SERVER_API_URL + 'api/prices';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/prices';

  constructor(protected http: HttpClient) {}

  create(price: IPrice): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(price);
    return this.http
      .post<IPrice>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(price: IPrice): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(price);
    return this.http
      .put<IPrice>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPrice>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPrice[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPrice[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateFromClient(price: IPrice): IPrice {
    const copy: IPrice = Object.assign({}, price, {
      from: price.from && price.from.isValid() ? price.from.toJSON() : undefined,
      to: price.to && price.to.isValid() ? price.to.toJSON() : undefined
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
      res.body.forEach((price: IPrice) => {
        price.from = price.from ? moment(price.from) : undefined;
        price.to = price.to ? moment(price.to) : undefined;
      });
    }
    return res;
  }
}
