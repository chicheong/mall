import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
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

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IShop[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    protected convertDateFromClient(shop: IShop): IShop {
        const copy: IShop = Object.assign({}, shop, {
            createdDate: shop.createdDate != null && shop.createdDate.isValid() ? shop.createdDate.toJSON() : null,
            lastModifiedDate: shop.lastModifiedDate != null && shop.lastModifiedDate.isValid() ? shop.lastModifiedDate.toJSON() : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.createdDate = res.body.createdDate != null ? moment(res.body.createdDate) : null;
            res.body.lastModifiedDate = res.body.lastModifiedDate != null ? moment(res.body.lastModifiedDate) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((shop: IShop) => {
                shop.createdDate = shop.createdDate != null ? moment(shop.createdDate) : null;
                shop.lastModifiedDate = shop.lastModifiedDate != null ? moment(shop.lastModifiedDate) : null;
            });
        }
        return res;
    }
}
