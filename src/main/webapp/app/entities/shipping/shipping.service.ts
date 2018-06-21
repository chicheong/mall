import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Shipping } from './shipping.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Shipping>;

@Injectable()
export class ShippingService {

    private resourceUrl =  SERVER_API_URL + 'api/shippings';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/shippings';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(shipping: Shipping): Observable<EntityResponseType> {
        const copy = this.convert(shipping);
        return this.http.post<Shipping>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(shipping: Shipping): Observable<EntityResponseType> {
        const copy = this.convert(shipping);
        return this.http.put<Shipping>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Shipping>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Shipping[]>> {
        const options = createRequestOption(req);
        return this.http.get<Shipping[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Shipping[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<Shipping[]>> {
        const options = createRequestOption(req);
        return this.http.get<Shipping[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Shipping[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Shipping = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Shipping[]>): HttpResponse<Shipping[]> {
        const jsonResponse: Shipping[] = res.body;
        const body: Shipping[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Shipping.
     */
    private convertItemFromServer(shipping: Shipping): Shipping {
        const copy: Shipping = Object.assign({}, shipping);
        copy.date = this.dateUtils
            .convertDateTimeFromServer(shipping.date);
        return copy;
    }

    /**
     * Convert a Shipping to a JSON which can be sent to the server.
     */
    private convert(shipping: Shipping): Shipping {
        const copy: Shipping = Object.assign({}, shipping);

        copy.date = this.dateUtils.toDate(shipping.date);
        return copy;
    }
}
