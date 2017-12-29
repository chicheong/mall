import { BaseEntity } from './../../shared';

export const enum ProductStyleType {
    'COLOR',
    'SIZE'
}

export class ProductStyleHistory implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public code?: string,
        public isDefault?: boolean,
        public type?: ProductStyleType,
        public createdBy?: string,
        public createdDate?: any,
    ) {
        this.isDefault = false;
    }
}
