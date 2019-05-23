import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
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

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IProductHistory[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    protected convertDateFromClient(productHistory: IProductHistory): IProductHistory {
        const copy: IProductHistory = Object.assign({}, productHistory, {
            createdDate:
                productHistory.createdDate != null && productHistory.createdDate.isValid() ? productHistory.createdDate.toJSON() : null
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
            res.body.forEach((productHistory: IProductHistory) => {
                productHistory.createdDate = productHistory.createdDate != null ? moment(productHistory.createdDate) : null;
            });
        }
        return res;
    }
}
