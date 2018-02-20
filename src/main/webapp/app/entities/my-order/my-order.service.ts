import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { MyOrder } from './my-order.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<MyOrder>;

@Injectable()
export class MyOrderService {

    private resourceUrl =  SERVER_API_URL + 'api/my-orders';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/my-orders';

    constructor(private http: HttpClient) { }

    create(myOrder: MyOrder): Observable<EntityResponseType> {
        const copy = this.convert(myOrder);
        return this.http.post<MyOrder>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(myOrder: MyOrder): Observable<EntityResponseType> {
        const copy = this.convert(myOrder);
        return this.http.put<MyOrder>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<MyOrder>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<MyOrder[]>> {
        const options = createRequestOption(req);
        return this.http.get<MyOrder[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<MyOrder[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<MyOrder[]>> {
        const options = createRequestOption(req);
        return this.http.get<MyOrder[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<MyOrder[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: MyOrder = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<MyOrder[]>): HttpResponse<MyOrder[]> {
        const jsonResponse: MyOrder[] = res.body;
        const body: MyOrder[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to MyOrder.
     */
    private convertItemFromServer(myOrder: MyOrder): MyOrder {
        const copy: MyOrder = Object.assign({}, myOrder);
        return copy;
    }

    /**
     * Convert a MyOrder to a JSON which can be sent to the server.
     */
    private convert(myOrder: MyOrder): MyOrder {
        const copy: MyOrder = Object.assign({}, myOrder);
        return copy;
    }
}
