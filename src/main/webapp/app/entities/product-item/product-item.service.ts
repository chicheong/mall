import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { ProductItem } from './product-item.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class ProductItemService {

    private resourceUrl = SERVER_API_URL + 'api/product-items';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/product-items';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(productItem: ProductItem): Observable<ProductItem> {
        const copy = this.convert(productItem);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(productItem: ProductItem): Observable<ProductItem> {
        const copy = this.convert(productItem);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<ProductItem> {
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
     * Convert a returned JSON object to ProductItem.
     */
    private convertItemFromServer(json: any): ProductItem {
        const entity: ProductItem = Object.assign(new ProductItem(), json);
        entity.createdDate = this.dateUtils
            .convertDateTimeFromServer(json.createdDate);
        entity.lastModifiedDate = this.dateUtils
            .convertDateTimeFromServer(json.lastModifiedDate);
        return entity;
    }

    /**
     * Convert a ProductItem to a JSON which can be sent to the server.
     */
    private convert(productItem: ProductItem): ProductItem {
        const copy: ProductItem = Object.assign({}, productItem);

        copy.createdDate = this.dateUtils.toDate(productItem.createdDate);

        copy.lastModifiedDate = this.dateUtils.toDate(productItem.lastModifiedDate);
        return copy;
    }
}
