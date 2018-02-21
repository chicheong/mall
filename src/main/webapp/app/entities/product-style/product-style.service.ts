import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { ProductStyle } from './product-style.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<ProductStyle>;

@Injectable()
export class ProductStyleService {

    private resourceUrl = SERVER_API_URL + 'api/product-styles';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/product-styles';

    constructor(private http: HttpClient) { }

    create(productStyle: ProductStyle): Observable<EntityResponseType> {
        const copy = this.convert(productStyle);
        return this.http.post<ProductStyle>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(productStyle: ProductStyle): Observable<EntityResponseType> {
        const copy = this.convert(productStyle);
        return this.http.put<ProductStyle>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ProductStyle>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<ProductStyle[]>> {
        const options = createRequestOption(req);
        return this.http.get<ProductStyle[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<ProductStyle[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<ProductStyle[]>> {
        const options = createRequestOption(req);
        return this.http.get<ProductStyle[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<ProductStyle[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: ProductStyle = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<ProductStyle[]>): HttpResponse<ProductStyle[]> {
        const jsonResponse: ProductStyle[] = res.body;
        const body: ProductStyle[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to ProductStyle.
     */
    private convertItemFromServer(productStyle: ProductStyle): ProductStyle {
        const copy: ProductStyle = Object.assign({}, productStyle);
        return copy;
    }

    /**
     * Convert a ProductStyle to a JSON which can be sent to the server.
     */
    private convert(productStyle: ProductStyle): ProductStyle {
        const copy: ProductStyle = Object.assign({}, productStyle);
        return copy;
    }
}
