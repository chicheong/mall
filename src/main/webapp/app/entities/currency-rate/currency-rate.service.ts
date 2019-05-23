import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ICurrencyRate } from 'app/shared/model/currency-rate.model';

type EntityResponseType = HttpResponse<ICurrencyRate>;
type EntityArrayResponseType = HttpResponse<ICurrencyRate[]>;

@Injectable({ providedIn: 'root' })
export class CurrencyRateService {
    public resourceUrl = SERVER_API_URL + 'api/currency-rates';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/currency-rates';

    constructor(protected http: HttpClient) {}

    create(currencyRate: ICurrencyRate): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(currencyRate);
        return this.http
            .post<ICurrencyRate>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(currencyRate: ICurrencyRate): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(currencyRate);
        return this.http
            .put<ICurrencyRate>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<ICurrencyRate>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<ICurrencyRate[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<ICurrencyRate[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    protected convertDateFromClient(currencyRate: ICurrencyRate): ICurrencyRate {
        const copy: ICurrencyRate = Object.assign({}, currencyRate, {
            from: currencyRate.from != null && currencyRate.from.isValid() ? currencyRate.from.toJSON() : null,
            to: currencyRate.to != null && currencyRate.to.isValid() ? currencyRate.to.toJSON() : null
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
            res.body.forEach((currencyRate: ICurrencyRate) => {
                currencyRate.from = currencyRate.from != null ? moment(currencyRate.from) : null;
                currencyRate.to = currencyRate.to != null ? moment(currencyRate.to) : null;
            });
        }
        return res;
    }
}
