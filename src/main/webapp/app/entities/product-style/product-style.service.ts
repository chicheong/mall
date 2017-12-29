import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { ProductStyle } from './product-style.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class ProductStyleService {

    private resourceUrl = SERVER_API_URL + 'api/product-styles';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/product-styles';

    constructor(private http: Http) { }

    create(productStyle: ProductStyle): Observable<ProductStyle> {
        const copy = this.convert(productStyle);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(productStyle: ProductStyle): Observable<ProductStyle> {
        const copy = this.convert(productStyle);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<ProductStyle> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceSearchUrl, options)
            .map((res: any) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to ProductStyle.
     */
    private convertItemFromServer(json: any): ProductStyle {
        const entity: ProductStyle = Object.assign(new ProductStyle(), json);
        return entity;
    }

    /**
     * Convert a ProductStyle to a JSON which can be sent to the server.
     */
    private convert(productStyle: ProductStyle): ProductStyle {
        const copy: ProductStyle = Object.assign({}, productStyle);
        return copy;
    }
}
