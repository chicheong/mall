import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { PaymentCard } from './payment-card.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<PaymentCard>;

@Injectable()
export class PaymentCardService {

    private resourceUrl =  SERVER_API_URL + 'api/payment-cards';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/payment-cards';

    constructor(private http: HttpClient) { }

    create(paymentCard: PaymentCard): Observable<EntityResponseType> {
        const copy = this.convert(paymentCard);
        return this.http.post<PaymentCard>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(paymentCard: PaymentCard): Observable<EntityResponseType> {
        const copy = this.convert(paymentCard);
        return this.http.put<PaymentCard>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<PaymentCard>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<PaymentCard[]>> {
        const options = createRequestOption(req);
        return this.http.get<PaymentCard[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<PaymentCard[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<PaymentCard[]>> {
        const options = createRequestOption(req);
        return this.http.get<PaymentCard[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<PaymentCard[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: PaymentCard = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<PaymentCard[]>): HttpResponse<PaymentCard[]> {
        const jsonResponse: PaymentCard[] = res.body;
        const body: PaymentCard[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to PaymentCard.
     */
    private convertItemFromServer(paymentCard: PaymentCard): PaymentCard {
        const copy: PaymentCard = Object.assign({}, paymentCard);
        return copy;
    }

    /**
     * Convert a PaymentCard to a JSON which can be sent to the server.
     */
    private convert(paymentCard: PaymentCard): PaymentCard {
        const copy: PaymentCard = Object.assign({}, paymentCard);
        return copy;
    }
}
