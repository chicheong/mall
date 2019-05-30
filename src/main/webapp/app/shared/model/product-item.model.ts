import { IProductStyle } from 'app/shared/model/product-style.model';
import { IPrice } from 'app/shared/model/price.model';
import { IQuantity } from 'app/shared/model/quantity.model';
import { IProduct } from 'app/shared/model/product.model';
import { IUrl } from 'app/shared/model/url.model';
import { CurrencyType } from './price.model';

export interface IProductItem {
    id?: number;
    tempId?: any;
    code?: string;
    isDefault?: boolean;
    quantity?: number;
    currency?: CurrencyType;
    price?: number;
    color?: IProductStyle;
    size?: IProductStyle;
    prices?: IPrice[];
    quantities?: IQuantity[];
    product?: IProduct;
    url?: IUrl;
    dirtyPrices?: boolean;
    dirtyQuantities?: boolean;
    dirtyUrl?: boolean;
}

export class ProductItem implements IProductItem {
    constructor(
        public id?: number,
        public tempId?: any,
        public code?: string,
        public isDefault?: boolean,
        public quantity?: number,
        public currency?: CurrencyType,
        public price?: number,
        public color?: IProductStyle,
        public size?: IProductStyle,
        public prices?: IPrice[],
        public quantities?: IQuantity[],
        public product?: IProduct,
        public url?: IUrl,
        public dirtyPrices?: boolean,
        public dirtyQuantities?: boolean,
        public dirtyUrl?: boolean
    ) {
        this.isDefault = this.isDefault || false;
    }
}
