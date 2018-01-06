import { BaseEntity } from './../../shared';

export const enum ProductStyleType {
    COLOR = 'COLOR',
    SIZE = 'SIZE'
}

export class ProductStyle implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public code?: string,
        public isDefault?: boolean,
        public type?: ProductStyleType,
        public product?: BaseEntity,
    ) {
        this.isDefault = false;
    }
}
