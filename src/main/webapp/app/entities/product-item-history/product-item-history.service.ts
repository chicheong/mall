import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { ProductItemHistory } from './product-item-history.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<ProductItemHistory>;

@Injectable()
export class ProductItemHistoryService {

    private resourceUrl =  SERVER_API_URL + 'api/product-item-histories';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/product-item-histories';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(productItemHistory: ProductItemHistory): Observable<EntityResponseType> {
        const copy = this.convert(productItemHistory);
        return this.http.post<ProductItemHistory>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(productItemHistory: ProductItemHistory): Observable<EntityResponseType> {
        const copy = this.convert(productItemHistory);
        return this.http.put<ProductItemHistory>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ProductItemHistory>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<ProductItemHistory[]>> {
        const options = createRequestOption(req);
        return this.http.get<ProductItemHistory[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<ProductItemHistory[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<ProductItemHistory[]>> {
        const options = createRequestOption(req);
        return this.http.get<ProductItemHistory[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<ProductItemHistory[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: ProductItemHistory = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<ProductItemHistory[]>): HttpResponse<ProductItemHistory[]> {
        const jsonResponse: ProductItemHistory[] = res.body;
        const body: ProductItemHistory[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to ProductItemHistory.
     */
    private convertItemFromServer(productItemHistory: ProductItemHistory): ProductItemHistory {
        const copy: ProductItemHistory = Object.assign({}, productItemHistory);
        copy.createdDate = this.dateUtils
            .convertDateTimeFromServer(productItemHistory.createdDate);
        copy.lastModifiedDate = this.dateUtils
            .convertDateTimeFromServer(productItemHistory.lastModifiedDate);
        return copy;
    }

    /**
     * Convert a ProductItemHistory to a JSON which can be sent to the server.
     */
    private convert(productItemHistory: ProductItemHistory): ProductItemHistory {
        const copy: ProductItemHistory = Object.assign({}, productItemHistory);

        copy.createdDate = this.dateUtils.toDate(productItemHistory.createdDate);

        copy.lastModifiedDate = this.dateUtils.toDate(productItemHistory.lastModifiedDate);
        return copy;
    }
}
