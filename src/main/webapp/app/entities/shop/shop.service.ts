import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils } from 'ng-jhipster';

import { Shop } from './shop.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class ShopService {

    private resourceUrl = 'api/shops';
    private resourceSearchUrl = 'api/_search/shops';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(shop: Shop): Observable<Shop> {
        const copy = this.convert(shop);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    update(shop: Shop): Observable<Shop> {
        const copy = this.convert(shop);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    find(id: number): Observable<Shop> {
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
        entity.createdDate = this.dateUtils
            .convertDateTimeFromServer(entity.createdDate);
        entity.lastModifiedDate = this.dateUtils
            .convertDateTimeFromServer(entity.lastModifiedDate);
    }

    private convert(shop: Shop): Shop {
        const copy: Shop = Object.assign({}, shop);

        copy.createdDate = this.dateUtils.toDate(shop.createdDate);

        copy.lastModifiedDate = this.dateUtils.toDate(shop.lastModifiedDate);
        return copy;
    }
}
