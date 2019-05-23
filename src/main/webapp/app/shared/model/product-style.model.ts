export const enum ProductStyleType {
    COLOR = 'COLOR',
    SIZE = 'SIZE'
}

export interface IProductStyle {
    id?: number;
    name?: string;
    code?: string;
    isDefault?: boolean;
    type?: ProductStyleType;
    productId?: number;
}

export class ProductStyle implements IProductStyle {
    constructor(
        public id?: number,
        public name?: string,
        public code?: string,
        public isDefault?: boolean,
        public type?: ProductStyleType,
        public productId?: number
    ) {
        this.isDefault = this.isDefault || false;
    }
}
