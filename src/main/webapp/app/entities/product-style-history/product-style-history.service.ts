import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { ProductStyleHistory } from './product-style-history.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<ProductStyleHistory>;

@Injectable()
export class ProductStyleHistoryService {

    private resourceUrl = SERVER_API_URL + 'api/product-style-histories';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/product-style-histories';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(productStyleHistory: ProductStyleHistory): Observable<EntityResponseType> {
        const copy = this.convert(productStyleHistory);
        return this.http.post<ProductStyleHistory>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(productStyleHistory: ProductStyleHistory): Observable<EntityResponseType> {
        const copy = this.convert(productStyleHistory);
        return this.http.put<ProductStyleHistory>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ProductStyleHistory>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<ProductStyleHistory[]>> {
        const options = createRequestOption(req);
        return this.http.get<ProductStyleHistory[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<ProductStyleHistory[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<ProductStyleHistory[]>> {
        const options = createRequestOption(req);
        return this.http.get<ProductStyleHistory[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<ProductStyleHistory[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: ProductStyleHistory = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<ProductStyleHistory[]>): HttpResponse<ProductStyleHistory[]> {
        const jsonResponse: ProductStyleHistory[] = res.body;
        const body: ProductStyleHistory[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to ProductStyleHistory.
     */
    private convertItemFromServer(productStyleHistory: ProductStyleHistory): ProductStyleHistory {
        const copy: ProductStyleHistory = Object.assign({}, productStyle);
        copy.createdDate = this.dateUtils
            .convertDateTimeFromServer(productStyleHistory.createdDate);
        return copy;
    }

    /**
     * Convert a ProductStyleHistory to a JSON which can be sent to the server.
     */
    private convert(productStyleHistory: ProductStyleHistory): ProductStyleHistory {
        const copy: ProductStyleHistory = Object.assign({}, productStyleHistory);
        copy.createdDate = this.dateUtils.toDate(productStyleHistory.createdDate);
        return copy;
    }
}
