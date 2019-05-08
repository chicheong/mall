import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { ShippingPriceRule } from './shipping-price-rule.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<ShippingPriceRule>;

@Injectable()
export class ShippingPriceRuleService {

    private resourceUrl =  SERVER_API_URL + 'api/shipping-price-rules';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/shipping-price-rules';

    constructor(private http: HttpClient) { }

    create(shippingPriceRule: ShippingPriceRule): Observable<EntityResponseType> {
        const copy = this.convert(shippingPriceRule);
        return this.http.post<ShippingPriceRule>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(shippingPriceRule: ShippingPriceRule): Observable<EntityResponseType> {
        const copy = this.convert(shippingPriceRule);
        return this.http.put<ShippingPriceRule>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ShippingPriceRule>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<ShippingPriceRule[]>> {
        const options = createRequestOption(req);
        return this.http.get<ShippingPriceRule[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<ShippingPriceRule[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<ShippingPriceRule[]>> {
        const options = createRequestOption(req);
        return this.http.get<ShippingPriceRule[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<ShippingPriceRule[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: ShippingPriceRule = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<ShippingPriceRule[]>): HttpResponse<ShippingPriceRule[]> {
        const jsonResponse: ShippingPriceRule[] = res.body;
        const body: ShippingPriceRule[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to ShippingPriceRule.
     */
    private convertItemFromServer(shippingPriceRule: ShippingPriceRule): ShippingPriceRule {
        const copy: ShippingPriceRule = Object.assign({}, shippingPriceRule);
        return copy;
    }

    /**
     * Convert a ShippingPriceRule to a JSON which can be sent to the server.
     */
    private convert(shippingPriceRule: ShippingPriceRule): ShippingPriceRule {
        const copy: ShippingPriceRule = Object.assign({}, shippingPriceRule);
        return copy;
    }
}
