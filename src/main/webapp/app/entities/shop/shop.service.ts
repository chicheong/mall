import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, SearchWithPagination } from 'app/shared/util/request-util';
import { IShop } from 'app/shared/model/shop.model';

type EntityResponseType = HttpResponse<IShop>;
type EntityArrayResponseType = HttpResponse<IShop[]>;

@Injectable({ providedIn: 'root' })
export class ShopService {
  public resourceUrl = SERVER_API_URL + 'api/shops';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/shops';

  constructor(protected http: HttpClient) {}

  create(shop: IShop): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shop);
    return this.http
      .post<IShop>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(shop: IShop): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shop);
    return this.http
      .put<IShop>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IShop>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IShop[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IShop[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateFromClient(shop: IShop): IShop {
    const copy: IShop = Object.assign({}, shop, {
      createdDate: shop.createdDate && shop.createdDate.isValid() ? shop.createdDate.toJSON() : undefined,
      lastModifiedDate: shop.lastModifiedDate && shop.lastModifiedDate.isValid() ? shop.lastModifiedDate.toJSON() : undefined
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.createdDate = res.body.createdDate ? moment(res.body.createdDate) : undefined;
      res.body.lastModifiedDate = res.body.lastModifiedDate ? moment(res.body.lastModifiedDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((shop: IShop) => {
        shop.createdDate = shop.createdDate ? moment(shop.createdDate) : undefined;
        shop.lastModifiedDate = shop.lastModifiedDate ? moment(shop.lastModifiedDate) : undefined;
      });
    }
    return res;
  }
}
