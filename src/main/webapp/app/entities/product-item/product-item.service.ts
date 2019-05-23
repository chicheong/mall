import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IProductItem } from 'app/shared/model/product-item.model';

type EntityResponseType = HttpResponse<IProductItem>;
type EntityArrayResponseType = HttpResponse<IProductItem[]>;

@Injectable({ providedIn: 'root' })
export class ProductItemService {
    public resourceUrl = SERVER_API_URL + 'api/product-items';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/product-items';

    constructor(protected http: HttpClient) {}

    create(productItem: IProductItem): Observable<EntityResponseType> {
        return this.http.post<IProductItem>(this.resourceUrl, productItem, { observe: 'response' });
    }

    update(productItem: IProductItem): Observable<EntityResponseType> {
        return this.http.put<IProductItem>(this.resourceUrl, productItem, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IProductItem>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IProductItem[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IProductItem[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
