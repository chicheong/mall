import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IMyOrder } from 'app/shared/model/my-order.model';

type EntityResponseType = HttpResponse<IMyOrder>;
type EntityArrayResponseType = HttpResponse<IMyOrder[]>;

@Injectable({ providedIn: 'root' })
export class MyOrderService {
    public resourceUrl = SERVER_API_URL + 'api/my-orders';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/my-orders';

    constructor(protected http: HttpClient) {}

    create(myOrder: IMyOrder): Observable<EntityResponseType> {
        return this.http.post<IMyOrder>(this.resourceUrl, myOrder, { observe: 'response' });
    }

    update(myOrder: IMyOrder): Observable<EntityResponseType> {
        return this.http.put<IMyOrder>(this.resourceUrl, myOrder, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IMyOrder>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IMyOrder[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IMyOrder[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
