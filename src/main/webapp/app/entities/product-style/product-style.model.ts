import { BaseEntity } from './../../shared';

export const enum ProductStyleType {
    COLOR = 'COLOR',
    SIZE = 'SIZE'
}

export class ProductStyle implements BaseEntity {
    constructor(
        public id?: number,
        public tempId?: any,
        public name?: string,
        public code?: string,
        public isDefault?: boolean,
        public type?: ProductStyleType,
        public product?: BaseEntity,
        public disabled?: boolean,
    ) {
        this.isDefault = false;
        this.disabled = false;
    }
}
