import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { UserInfo } from './user-info.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class UserInfoService {

    private resourceUrl = SERVER_API_URL + 'api/user-infos';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/user-infos';

    constructor(private http: Http) { }

    create(userInfo: UserInfo): Observable<UserInfo> {
        const copy = this.convert(userInfo);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(userInfo: UserInfo): Observable<UserInfo> {
        const copy = this.convert(userInfo);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<UserInfo> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
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
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to UserInfo.
     */
    private convertItemFromServer(json: any): UserInfo {
        const entity: UserInfo = Object.assign(new UserInfo(), json);
        return entity;
    }

    /**
     * Convert a UserInfo to a JSON which can be sent to the server.
     */
    private convert(userInfo: UserInfo): UserInfo {
        const copy: UserInfo = Object.assign({}, userInfo);
        return copy;
    }
}
