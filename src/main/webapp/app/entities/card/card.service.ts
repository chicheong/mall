import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ICard } from 'app/shared/model/card.model';

type EntityResponseType = HttpResponse<ICard>;
type EntityArrayResponseType = HttpResponse<ICard[]>;

@Injectable({ providedIn: 'root' })
export class CardService {
    public resourceUrl = SERVER_API_URL + 'api/cards';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/cards';

    constructor(protected http: HttpClient) {}

    create(card: ICard): Observable<EntityResponseType> {
        return this.http.post<ICard>(this.resourceUrl, card, { observe: 'response' });
    }

    update(card: ICard): Observable<EntityResponseType> {
        return this.http.put<ICard>(this.resourceUrl, card, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ICard>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ICard[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ICard[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
