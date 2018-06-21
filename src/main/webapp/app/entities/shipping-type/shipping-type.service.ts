import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { ShippingType } from './shipping-type.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<ShippingType>;

@Injectable()
export class ShippingTypeService {

    private resourceUrl =  SERVER_API_URL + 'api/shipping-types';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/shipping-types';

    constructor(private http: HttpClient) { }

    create(shippingType: ShippingType): Observable<EntityResponseType> {
        const copy = this.convert(shippingType);
        return this.http.post<ShippingType>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(shippingType: ShippingType): Observable<EntityResponseType> {
        const copy = this.convert(shippingType);
        return this.http.put<ShippingType>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ShippingType>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<ShippingType[]>> {
        const options = createRequestOption(req);
        return this.http.get<ShippingType[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<ShippingType[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<ShippingType[]>> {
        const options = createRequestOption(req);
        return this.http.get<ShippingType[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<ShippingType[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: ShippingType = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<ShippingType[]>): HttpResponse<ShippingType[]> {
        const jsonResponse: ShippingType[] = res.body;
        const body: ShippingType[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to ShippingType.
     */
    private convertItemFromServer(shippingType: ShippingType): ShippingType {
        const copy: ShippingType = Object.assign({}, shippingType);
        return copy;
    }

    /**
     * Convert a ShippingType to a JSON which can be sent to the server.
     */
    private convert(shippingType: ShippingType): ShippingType {
        const copy: ShippingType = Object.assign({}, shippingType);
        return copy;
    }
}
