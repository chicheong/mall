import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Price } from './price.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Price>;

@Injectable()
export class PriceService {

    private resourceUrl =  SERVER_API_URL + 'api/prices';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/prices';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(price: Price): Observable<EntityResponseType> {
        const copy = this.convert(price);
        return this.http.post<Price>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(price: Price): Observable<EntityResponseType> {
        const copy = this.convert(price);
        return this.http.put<Price>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Price>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Price[]>> {
        const options = createRequestOption(req);
        return this.http.get<Price[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Price[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<Price[]>> {
        const options = createRequestOption(req);
        return this.http.get<Price[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Price[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Price = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Price[]>): HttpResponse<Price[]> {
        const jsonResponse: Price[] = res.body;
        const body: Price[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Price.
     */
    convertItemFromServer(price: Price): Price {
        const copy: Price = Object.assign({}, price);
        copy.from = this.dateUtils
            .convertDateTimeFromServer(price.from);
        copy.to = this.dateUtils
            .convertDateTimeFromServer(price.to);
        return copy;
    }

    /**
     * Convert a Price to a JSON which can be sent to the server.
     */
    convert(price: Price): Price {
        const copy: Price = Object.assign({}, price);

        copy.from = this.dateUtils.toDate(price.from);

        copy.to = this.dateUtils.toDate(price.to);
        return copy;
    }
}
