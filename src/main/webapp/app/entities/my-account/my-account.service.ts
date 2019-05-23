import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IMyAccount } from 'app/shared/model/my-account.model';

type EntityResponseType = HttpResponse<IMyAccount>;
type EntityArrayResponseType = HttpResponse<IMyAccount[]>;

@Injectable({ providedIn: 'root' })
export class MyAccountService {
    public resourceUrl = SERVER_API_URL + 'api/my-accounts';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/my-accounts';

    constructor(protected http: HttpClient) {}

    create(myAccount: IMyAccount): Observable<EntityResponseType> {
        return this.http.post<IMyAccount>(this.resourceUrl, myAccount, { observe: 'response' });
    }

    update(myAccount: IMyAccount): Observable<EntityResponseType> {
        return this.http.put<IMyAccount>(this.resourceUrl, myAccount, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IMyAccount>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IMyAccount[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IMyAccount[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
