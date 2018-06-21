import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { PaymentCreditCard } from './payment-credit-card.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<PaymentCreditCard>;

@Injectable()
export class PaymentCreditCardService {

    private resourceUrl =  SERVER_API_URL + 'api/payment-credit-cards';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/payment-credit-cards';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(paymentCreditCard: PaymentCreditCard): Observable<EntityResponseType> {
        const copy = this.convert(paymentCreditCard);
        return this.http.post<PaymentCreditCard>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(paymentCreditCard: PaymentCreditCard): Observable<EntityResponseType> {
        const copy = this.convert(paymentCreditCard);
        return this.http.put<PaymentCreditCard>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<PaymentCreditCard>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<PaymentCreditCard[]>> {
        const options = createRequestOption(req);
        return this.http.get<PaymentCreditCard[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<PaymentCreditCard[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<PaymentCreditCard[]>> {
        const options = createRequestOption(req);
        return this.http.get<PaymentCreditCard[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<PaymentCreditCard[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: PaymentCreditCard = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<PaymentCreditCard[]>): HttpResponse<PaymentCreditCard[]> {
        const jsonResponse: PaymentCreditCard[] = res.body;
        const body: PaymentCreditCard[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to PaymentCreditCard.
     */
    private convertItemFromServer(paymentCreditCard: PaymentCreditCard): PaymentCreditCard {
        const copy: PaymentCreditCard = Object.assign({}, paymentCreditCard);
        copy.expireDate = this.dateUtils
            .convertDateTimeFromServer(paymentCreditCard.expireDate);
        return copy;
    }

    /**
     * Convert a PaymentCreditCard to a JSON which can be sent to the server.
     */
    private convert(paymentCreditCard: PaymentCreditCard): PaymentCreditCard {
        const copy: PaymentCreditCard = Object.assign({}, paymentCreditCard);

        copy.expireDate = this.dateUtils.toDate(paymentCreditCard.expireDate);
        return copy;
    }
}
