import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils } from 'ng-jhipster';

import { Price } from './price.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class PriceService {

    private resourceUrl = 'api/prices';
    private resourceSearchUrl = 'api/_search/prices';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(price: Price): Observable<Price> {
        const copy = this.convert(price);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    update(price: Price): Observable<Price> {
        const copy = this.convert(price);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    find(id: number): Observable<Price> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
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
        for (let i = 0; i < jsonResponse.length; i++) {
            this.convertItemFromServer(jsonResponse[i]);
        }
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convertItemFromServer(entity: any) {
        entity.from = this.dateUtils
            .convertDateTimeFromServer(entity.from);
        entity.to = this.dateUtils
            .convertDateTimeFromServer(entity.to);
    }

    private convert(price: Price): Price {
        const copy: Price = Object.assign({}, price);

        copy.from = this.dateUtils.toDate(price.from);

        copy.to = this.dateUtils.toDate(price.to);
        return copy;
    }
}
