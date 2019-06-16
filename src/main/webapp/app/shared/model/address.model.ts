import { ICountry } from 'app/shared/model/country.model';
import { IMyState } from 'app/shared/model/my-state.model';

export interface IAddress {
    id?: number;
    line1?: string;
    line2?: string;
    line3?: string;
    line4?: string;
    city?: string;
    postalCode?: string;
    country?: ICountry;
    myState?: IMyState;
}

export class Address implements IAddress {
    constructor(
        public id?: number,
        public line1?: string,
        public line2?: string,
        public line3?: string,
        public line4?: string,
        public city?: string,
        public postalCode?: string,
        public country?: ICountry,
        public myState?: IMyState
    ) {}
}
