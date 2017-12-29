import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { ProductStyleHistory } from './product-style-history.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class ProductStyleHistoryService {

    private resourceUrl = SERVER_API_URL + 'api/product-style-histories';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/product-style-histories';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(productStyleHistory: ProductStyleHistory): Observable<ProductStyleHistory> {
        const copy = this.convert(productStyleHistory);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(productStyleHistory: ProductStyleHistory): Observable<ProductStyleHistory> {
        const copy = this.convert(productStyleHistory);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<ProductStyleHistory> {
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
     * Convert a returned JSON object to ProductStyleHistory.
     */
    private convertItemFromServer(json: any): ProductStyleHistory {
        const entity: ProductStyleHistory = Object.assign(new ProductStyleHistory(), json);
        entity.createdDate = this.dateUtils
            .convertDateTimeFromServer(json.createdDate);
        return entity;
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
