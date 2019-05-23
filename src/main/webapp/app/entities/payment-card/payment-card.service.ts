import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IPaymentCard } from 'app/shared/model/payment-card.model';

type EntityResponseType = HttpResponse<IPaymentCard>;
type EntityArrayResponseType = HttpResponse<IPaymentCard[]>;

@Injectable({ providedIn: 'root' })
export class PaymentCardService {
    public resourceUrl = SERVER_API_URL + 'api/payment-cards';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/payment-cards';

    constructor(protected http: HttpClient) {}

    create(paymentCard: IPaymentCard): Observable<EntityResponseType> {
        return this.http.post<IPaymentCard>(this.resourceUrl, paymentCard, { observe: 'response' });
    }

    update(paymentCard: IPaymentCard): Observable<EntityResponseType> {
        return this.http.put<IPaymentCard>(this.resourceUrl, paymentCard, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IPaymentCard>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IPaymentCard[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IPaymentCard[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
