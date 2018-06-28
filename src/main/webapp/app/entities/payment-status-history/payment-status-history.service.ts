import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { PaymentStatusHistory } from './payment-status-history.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<PaymentStatusHistory>;

@Injectable()
export class PaymentStatusHistoryService {

    private resourceUrl =  SERVER_API_URL + 'api/payment-status-histories';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/payment-status-histories';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(paymentStatusHistory: PaymentStatusHistory): Observable<EntityResponseType> {
        const copy = this.convert(paymentStatusHistory);
        return this.http.post<PaymentStatusHistory>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(paymentStatusHistory: PaymentStatusHistory): Observable<EntityResponseType> {
        const copy = this.convert(paymentStatusHistory);
        return this.http.put<PaymentStatusHistory>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<PaymentStatusHistory>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<PaymentStatusHistory[]>> {
        const options = createRequestOption(req);
        return this.http.get<PaymentStatusHistory[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<PaymentStatusHistory[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<PaymentStatusHistory[]>> {
        const options = createRequestOption(req);
        return this.http.get<PaymentStatusHistory[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<PaymentStatusHistory[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: PaymentStatusHistory = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<PaymentStatusHistory[]>): HttpResponse<PaymentStatusHistory[]> {
        const jsonResponse: PaymentStatusHistory[] = res.body;
        const body: PaymentStatusHistory[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to PaymentStatusHistory.
     */
    private convertItemFromServer(paymentStatusHistory: PaymentStatusHistory): PaymentStatusHistory {
        const copy: PaymentStatusHistory = Object.assign({}, paymentStatusHistory);
        copy.effectiveDate = this.dateUtils
            .convertDateTimeFromServer(paymentStatusHistory.effectiveDate);
        return copy;
    }

    /**
     * Convert a PaymentStatusHistory to a JSON which can be sent to the server.
     */
    private convert(paymentStatusHistory: PaymentStatusHistory): PaymentStatusHistory {
        const copy: PaymentStatusHistory = Object.assign({}, paymentStatusHistory);

        copy.effectiveDate = this.dateUtils.toDate(paymentStatusHistory.effectiveDate);
        return copy;
    }
}
