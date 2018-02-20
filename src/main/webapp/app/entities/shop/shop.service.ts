import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Shop } from './shop.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Shop>;

@Injectable()
export class ShopService {

    private resourceUrl =  SERVER_API_URL + 'api/shops';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/shops';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(shop: Shop): Observable<EntityResponseType> {
        const copy = this.convert(shop);
        return this.http.post<Shop>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(shop: Shop): Observable<EntityResponseType> {
        const copy = this.convert(shop);
        return this.http.put<Shop>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Shop>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Shop[]>> {
        const options = createRequestOption(req);
        return this.http.get<Shop[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Shop[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<Shop[]>> {
        const options = createRequestOption(req);
        return this.http.get<Shop[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Shop[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Shop = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Shop[]>): HttpResponse<Shop[]> {
        const jsonResponse: Shop[] = res.body;
        const body: Shop[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Shop.
     */
    private convertItemFromServer(shop: Shop): Shop {
        const copy: Shop = Object.assign({}, shop);
        copy.createdDate = this.dateUtils
            .convertDateTimeFromServer(shop.createdDate);
        copy.lastModifiedDate = this.dateUtils
            .convertDateTimeFromServer(shop.lastModifiedDate);
        return copy;
    }

    /**
     * Convert a Shop to a JSON which can be sent to the server.
     */
    private convert(shop: Shop): Shop {
        const copy: Shop = Object.assign({}, shop);

        copy.createdDate = this.dateUtils.toDate(shop.createdDate);

        copy.lastModifiedDate = this.dateUtils.toDate(shop.lastModifiedDate);
        return copy;
    }
}
