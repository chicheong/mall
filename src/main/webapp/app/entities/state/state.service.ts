import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { State } from './state.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class StateService {

    private resourceUrl = SERVER_API_URL + 'api/states';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/states';

    constructor(private http: Http) { }

    create(state: State): Observable<State> {
        const copy = this.convert(state);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(state: State): Observable<State> {
        const copy = this.convert(state);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<State> {
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
     * Convert a returned JSON object to State.
     */
    private convertItemFromServer(json: any): State {
        const entity: State = Object.assign(new State(), json);
        return entity;
    }

    /**
     * Convert a State to a JSON which can be sent to the server.
     */
    private convert(state: State): State {
        const copy: State = Object.assign({}, state);
        return copy;
    }
}
