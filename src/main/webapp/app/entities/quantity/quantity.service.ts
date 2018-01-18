import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Quantity } from './quantity.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class QuantityService {

    private resourceUrl = SERVER_API_URL + 'api/quantities';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/quantities';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(quantity: Quantity): Observable<Quantity> {
        const copy = this.convert(quantity);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(quantity: Quantity): Observable<Quantity> {
        const copy = this.convert(quantity);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<Quantity> {
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
     * Convert a returned JSON object to Quantity.
     */
    convertItemFromServer(json: any): Quantity {
        const entity: Quantity = Object.assign(new Quantity(), json);
        entity.from = this.dateUtils
            .convertDateTimeFromServer(json.from);
        entity.to = this.dateUtils
            .convertDateTimeFromServer(json.to);
        return entity;
    }

    /**
     * Convert a Quantity to a JSON which can be sent to the server.
     */
    convert(quantity: Quantity): Quantity {
        const copy: Quantity = Object.assign({}, quantity);

        copy.from = this.dateUtils.toDate(quantity.from);

        copy.to = this.dateUtils.toDate(quantity.to);
        return copy;
    }
}