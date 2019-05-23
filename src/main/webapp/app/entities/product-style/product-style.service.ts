import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IProductStyle } from 'app/shared/model/product-style.model';

type EntityResponseType = HttpResponse<IProductStyle>;
type EntityArrayResponseType = HttpResponse<IProductStyle[]>;

@Injectable({ providedIn: 'root' })
export class ProductStyleService {
    public resourceUrl = SERVER_API_URL + 'api/product-styles';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/product-styles';

    constructor(protected http: HttpClient) {}

    create(productStyle: IProductStyle): Observable<EntityResponseType> {
        return this.http.post<IProductStyle>(this.resourceUrl, productStyle, { observe: 'response' });
    }

    update(productStyle: IProductStyle): Observable<EntityResponseType> {
        return this.http.put<IProductStyle>(this.resourceUrl, productStyle, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IProductStyle>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IProductStyle[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IProductStyle[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
