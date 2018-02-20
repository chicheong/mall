import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { MyAccount } from './my-account.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<MyAccount>;

@Injectable()
export class MyAccountService {

    private resourceUrl =  SERVER_API_URL + 'api/my-accounts';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/my-accounts';

    constructor(private http: HttpClient) { }

    create(myAccount: MyAccount): Observable<EntityResponseType> {
        const copy = this.convert(myAccount);
        return this.http.post<MyAccount>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(myAccount: MyAccount): Observable<EntityResponseType> {
        const copy = this.convert(myAccount);
        return this.http.put<MyAccount>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<MyAccount>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<MyAccount[]>> {
        const options = createRequestOption(req);
        return this.http.get<MyAccount[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<MyAccount[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<MyAccount[]>> {
        const options = createRequestOption(req);
        return this.http.get<MyAccount[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<MyAccount[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: MyAccount = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<MyAccount[]>): HttpResponse<MyAccount[]> {
        const jsonResponse: MyAccount[] = res.body;
        const body: MyAccount[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to MyAccount.
     */
    private convertItemFromServer(myAccount: MyAccount): MyAccount {
        const copy: MyAccount = Object.assign({}, myAccount);
        return copy;
    }

    /**
     * Convert a MyAccount to a JSON which can be sent to the server.
     */
    private convert(myAccount: MyAccount): MyAccount {
        const copy: MyAccount = Object.assign({}, myAccount);
        return copy;
    }
}
