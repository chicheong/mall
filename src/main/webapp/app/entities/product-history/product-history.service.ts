import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, SearchWithPagination } from 'app/shared/util/request-util';
import { IProductHistory } from 'app/shared/model/product-history.model';

type EntityResponseType = HttpResponse<IProductHistory>;
type EntityArrayResponseType = HttpResponse<IProductHistory[]>;

@Injectable({ providedIn: 'root' })
export class ProductHistoryService {
  public resourceUrl = SERVER_API_URL + 'api/product-histories';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/product-histories';

  constructor(protected http: HttpClient) {}

  create(productHistory: IProductHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productHistory);
    return this.http
      .post<IProductHistory>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(productHistory: IProductHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productHistory);
    return this.http
      .put<IProductHistory>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IProductHistory>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProductHistory[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProductHistory[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateFromClient(productHistory: IProductHistory): IProductHistory {
    const copy: IProductHistory = Object.assign({}, productHistory, {
      createdDate: productHistory.createdDate && productHistory.createdDate.isValid() ? productHistory.createdDate.toJSON() : undefined
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.createdDate = res.body.createdDate ? moment(res.body.createdDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((productHistory: IProductHistory) => {
        productHistory.createdDate = productHistory.createdDate ? moment(productHistory.createdDate) : undefined;
      });
    }
    return res;
  }
}
