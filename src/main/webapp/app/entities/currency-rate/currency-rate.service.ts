import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { CurrencyRate } from './currency-rate.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<CurrencyRate>;

@Injectable()
export class CurrencyRateService {

    private resourceUrl =  SERVER_API_URL + 'api/currency-rates';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/currency-rates';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(currencyRate: CurrencyRate): Observable<EntityResponseType> {
        const copy = this.convert(currencyRate);
        return this.http.post<CurrencyRate>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(currencyRate: CurrencyRate): Observable<EntityResponseType> {
        const copy = this.convert(currencyRate);
        return this.http.put<CurrencyRate>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<CurrencyRate>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<CurrencyRate[]>> {
        const options = createRequestOption(req);
        return this.http.get<CurrencyRate[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<CurrencyRate[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<CurrencyRate[]>> {
        const options = createRequestOption(req);
        return this.http.get<CurrencyRate[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<CurrencyRate[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: CurrencyRate = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<CurrencyRate[]>): HttpResponse<CurrencyRate[]> {
        const jsonResponse: CurrencyRate[] = res.body;
        const body: CurrencyRate[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to CurrencyRate.
     */
    private convertItemFromServer(currencyRate: CurrencyRate): CurrencyRate {
        const copy: CurrencyRate = Object.assign({}, currencyRate);
        copy.from = this.dateUtils
            .convertDateTimeFromServer(currencyRate.from);
        copy.to = this.dateUtils
            .convertDateTimeFromServer(currencyRate.to);
        return copy;
    }

    /**
     * Convert a CurrencyRate to a JSON which can be sent to the server.
     */
    private convert(currencyRate: CurrencyRate): CurrencyRate {
        const copy: CurrencyRate = Object.assign({}, currencyRate);

        copy.from = this.dateUtils.toDate(currencyRate.from);

        copy.to = this.dateUtils.toDate(currencyRate.to);
        return copy;
    }
}
