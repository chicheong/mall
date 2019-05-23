import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IProductItemHistory } from 'app/shared/model/product-item-history.model';

type EntityResponseType = HttpResponse<IProductItemHistory>;
type EntityArrayResponseType = HttpResponse<IProductItemHistory[]>;

@Injectable({ providedIn: 'root' })
export class ProductItemHistoryService {
    public resourceUrl = SERVER_API_URL + 'api/product-item-histories';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/product-item-histories';

    constructor(protected http: HttpClient) {}

    create(productItemHistory: IProductItemHistory): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(productItemHistory);
        return this.http
            .post<IProductItemHistory>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(productItemHistory: IProductItemHistory): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(productItemHistory);
        return this.http
            .put<IProductItemHistory>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IProductItemHistory>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IProductItemHistory[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IProductItemHistory[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    protected convertDateFromClient(productItemHistory: IProductItemHistory): IProductItemHistory {
        const copy: IProductItemHistory = Object.assign({}, productItemHistory, {
            createdDate:
                productItemHistory.createdDate != null && productItemHistory.createdDate.isValid()
                    ? productItemHistory.createdDate.toJSON()
                    : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.createdDate = res.body.createdDate != null ? moment(res.body.createdDate) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((productItemHistory: IProductItemHistory) => {
                productItemHistory.createdDate = productItemHistory.createdDate != null ? moment(productItemHistory.createdDate) : null;
            });
        }
        return res;
    }
}
