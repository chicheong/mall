import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IShippingPriceRule } from 'app/shared/model/shipping-price-rule.model';

type EntityResponseType = HttpResponse<IShippingPriceRule>;
type EntityArrayResponseType = HttpResponse<IShippingPriceRule[]>;

@Injectable({ providedIn: 'root' })
export class ShippingPriceRuleService {
    public resourceUrl = SERVER_API_URL + 'api/shipping-price-rules';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/shipping-price-rules';

    constructor(protected http: HttpClient) {}

    create(shippingPriceRule: IShippingPriceRule): Observable<EntityResponseType> {
        return this.http.post<IShippingPriceRule>(this.resourceUrl, shippingPriceRule, { observe: 'response' });
    }

    update(shippingPriceRule: IShippingPriceRule): Observable<EntityResponseType> {
        return this.http.put<IShippingPriceRule>(this.resourceUrl, shippingPriceRule, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IShippingPriceRule>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IShippingPriceRule[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IShippingPriceRule[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
