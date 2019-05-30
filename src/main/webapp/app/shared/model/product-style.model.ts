import { IProduct } from 'app/shared/model/product.model';
import { IUrl } from 'app/shared/model/url.model';

export const enum ProductStyleType {
    COLOR = 'COLOR',
    SIZE = 'SIZE'
}

export interface IProductStyle {
    id?: number;
    tempId?: any;
    name?: string;
    code?: string;
    isDefault?: boolean;
    type?: ProductStyleType;
    productId?: IProduct;
    url?: IUrl;
    dirtyUrl?: boolean;
    disabled?: boolean;
}

export class ProductStyle implements IProductStyle {
    constructor(
        public id?: number,
        public tempId?: any,
        public name?: string,
        public code?: string,
        public isDefault?: boolean,
        public type?: ProductStyleType,
        public product?: IProduct,
        public url?: IUrl,
        public dirtyUrl?: boolean,
        public disabled?: boolean
    ) {
        this.isDefault = this.isDefault || false;
    }
}
