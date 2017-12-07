import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { UserInfo } from './user-info.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class UserInfoService {

    private resourceUrl = 'api/user-infos';
    private resourceSearchUrl = 'api/_search/user-infos';

    constructor(private http: Http) { }

    create(userInfo: UserInfo): Observable<UserInfo> {
        const copy = this.convert(userInfo);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(userInfo: UserInfo): Observable<UserInfo> {
        const copy = this.convert(userInfo);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<UserInfo> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
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
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(userInfo: UserInfo): UserInfo {
        const copy: UserInfo = Object.assign({}, userInfo);
        return copy;
    }
}
