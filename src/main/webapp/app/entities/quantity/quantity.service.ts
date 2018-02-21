import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Quantity } from './quantity.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Quantity>;

@Injectable()
export class QuantityService {

    private resourceUrl = SERVER_API_URL + 'api/quantities';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/quantities';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(quantity: Quantity): Observable<EntityResponseType> {
        const copy = this.convert(quantity);
        return this.http.post<Quantity>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(quantity: Quantity): Observable<EntityResponseType> {
        const copy = this.convert(quantity);
        return this.http.put<Quantity>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Quantity>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Quantity[]>> {
        const options = createRequestOption(req);
        return this.http.get<Quantity[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Quantity[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<Quantity[]>> {
        const options = createRequestOption(req);
        return this.http.get<Quantity[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Quantity[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Quantity = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Quantity[]>): HttpResponse<Quantity[]> {
        const jsonResponse: Quantity[] = res.body;
        const body: Quantity[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Quantity.
     */
    convertItemFromServer(quantity: Quantity): Quantity {
        const copy: Quantity = Object.assign({}, quantity);
        copy.from = this.dateUtils
            .convertDateTimeFromServer(quantity.from);
        copy.to = this.dateUtils
            .convertDateTimeFromServer(quantity.to);
        return copy;
    }

    /**
     * Convert a Quantity to a JSON which can be sent to the server.
     */
    convert(quantity: Quantity): Quantity {
        const copy: Quantity = Object.assign({}, quantity);
        copy.from = this.dateUtils.toDate(quantity.from);
        copy.to = this.dateUtils.toDate(quantity.to);
        return copy;
    }
}
