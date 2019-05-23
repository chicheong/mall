export interface IAddress {
    id?: number;
    line1?: string;
    line2?: string;
    line3?: string;
    line4?: string;
    city?: string;
    postalCode?: string;
    countryId?: number;
    stateId?: number;
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
        public countryId?: number,
        public stateId?: number
    ) {}
}
