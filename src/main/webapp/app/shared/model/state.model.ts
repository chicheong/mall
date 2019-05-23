import { ICountry } from 'app/shared/model/country.model';

export interface IState {
    id?: number;
    code?: string;
    label?: string;
    name?: string;
    country?: ICountry;
}

export class State implements IState {
    constructor(public id?: number, public code?: string, public label?: string, public name?: string, public country?: ICountry) {}
}
