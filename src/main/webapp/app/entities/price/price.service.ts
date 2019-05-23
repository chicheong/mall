import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
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

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IPrice[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    protected convertDateFromClient(price: IPrice): IPrice {
        const copy: IPrice = Object.assign({}, price, {
            from: price.from != null && price.from.isValid() ? price.from.toJSON() : null,
            to: price.to != null && price.to.isValid() ? price.to.toJSON() : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.from = res.body.from != null ? moment(res.body.from) : null;
            res.body.to = res.body.to != null ? moment(res.body.to) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((price: IPrice) => {
                price.from = price.from != null ? moment(price.from) : null;
                price.to = price.to != null ? moment(price.to) : null;
            });
        }
        return res;
    }
}
