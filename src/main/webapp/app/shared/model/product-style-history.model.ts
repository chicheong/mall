import { Moment } from 'moment';

export const enum ProductStyleType {
    COLOR = 'COLOR',
    SIZE = 'SIZE'
}

export interface IProductStyleHistory {
    id?: number;
    name?: string;
    code?: string;
    isDefault?: boolean;
    type?: ProductStyleType;
    createdBy?: string;
    createdDate?: Moment;
}

export class ProductStyleHistory implements IProductStyleHistory {
    constructor(
        public id?: number,
        public name?: string,
        public code?: string,
        public isDefault?: boolean,
        public type?: ProductStyleType,
        public createdBy?: string,
        public createdDate?: Moment
    ) {
        this.isDefault = this.isDefault || false;
    }
}
