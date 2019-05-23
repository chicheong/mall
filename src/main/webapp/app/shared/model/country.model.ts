export interface ICountry {
    id?: number;
    code?: string;
    label?: string;
    num?: string;
    name?: string;
}

export class Country implements ICountry {
    constructor(public id?: number, public code?: string, public label?: string, public num?: string, public name?: string) {}
}
