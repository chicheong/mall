import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { ProductItem } from './product-item.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<ProductItem>;

@Injectable()
export class ProductItemService {

    private resourceUrl =  SERVER_API_URL + 'api/product-items';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/product-items';

    constructor(private http: HttpClient) { }

    create(productItem: ProductItem): Observable<EntityResponseType> {
        const copy = this.convert(productItem);
        return this.http.post<ProductItem>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(productItem: ProductItem): Observable<EntityResponseType> {
        const copy = this.convert(productItem);
        return this.http.put<ProductItem>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ProductItem>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<ProductItem[]>> {
        const options = createRequestOption(req);
        return this.http.get<ProductItem[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<ProductItem[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<ProductItem[]>> {
        const options = createRequestOption(req);
        return this.http.get<ProductItem[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<ProductItem[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: ProductItem = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<ProductItem[]>): HttpResponse<ProductItem[]> {
        const jsonResponse: ProductItem[] = res.body;
        const body: ProductItem[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to ProductItem.
     */
    private convertItemFromServer(productItem: ProductItem): ProductItem {
        const copy: ProductItem = Object.assign({}, productItem);
        return copy;
    }

    /**
     * Convert a ProductItem to a JSON which can be sent to the server.
     */
    private convert(productItem: ProductItem): ProductItem {
        const copy: ProductItem = Object.assign({}, productItem);
        return copy;
    }
}
