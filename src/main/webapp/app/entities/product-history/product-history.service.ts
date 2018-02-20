import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { ProductHistory } from './product-history.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<ProductHistory>;

@Injectable()
export class ProductHistoryService {

    private resourceUrl =  SERVER_API_URL + 'api/product-histories';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/product-histories';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(productHistory: ProductHistory): Observable<EntityResponseType> {
        const copy = this.convert(productHistory);
        return this.http.post<ProductHistory>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(productHistory: ProductHistory): Observable<EntityResponseType> {
        const copy = this.convert(productHistory);
        return this.http.put<ProductHistory>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ProductHistory>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<ProductHistory[]>> {
        const options = createRequestOption(req);
        return this.http.get<ProductHistory[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<ProductHistory[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<ProductHistory[]>> {
        const options = createRequestOption(req);
        return this.http.get<ProductHistory[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<ProductHistory[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: ProductHistory = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<ProductHistory[]>): HttpResponse<ProductHistory[]> {
        const jsonResponse: ProductHistory[] = res.body;
        const body: ProductHistory[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to ProductHistory.
     */
    private convertItemFromServer(productHistory: ProductHistory): ProductHistory {
        const copy: ProductHistory = Object.assign({}, productHistory);
        copy.createdDate = this.dateUtils
            .convertDateTimeFromServer(productHistory.createdDate);
        copy.lastModifiedDate = this.dateUtils
            .convertDateTimeFromServer(productHistory.lastModifiedDate);
        return copy;
    }

    /**
     * Convert a ProductHistory to a JSON which can be sent to the server.
     */
    private convert(productHistory: ProductHistory): ProductHistory {
        const copy: ProductHistory = Object.assign({}, productHistory);

        copy.createdDate = this.dateUtils.toDate(productHistory.createdDate);
        copy.lastModifiedDate = this.dateUtils.toDate(productHistory.lastModifiedDate);
        return copy;
    }
}
