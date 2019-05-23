import { Moment } from 'moment';
import { IProductStyle } from 'app/shared/model/product-style.model';
import { IProductItem } from 'app/shared/model/product-item.model';
import { ICategory } from 'app/shared/model/category.model';

export const enum ProductStatus {
    ACTIVE = 'ACTIVE',
    RESTRICTED = 'RESTRICTED',
    INACTIVE = 'INACTIVE'
}

export interface IProduct {
    id?: number;
    name?: string;
    code?: string;
    brand?: string;
    description?: string;
    content?: string;
    remark?: string;
    status?: ProductStatus;
    createdBy?: string;
    createdDate?: Moment;
    lastModifiedBy?: string;
    lastModifiedDate?: Moment;
    styles?: IProductStyle[];
    items?: IProductItem[];
    shopId?: number;
    categories?: ICategory[];
}

export class Product implements IProduct {
    constructor(
        public id?: number,
        public name?: string,
        public code?: string,
        public brand?: string,
        public description?: string,
        public content?: string,
        public remark?: string,
        public status?: ProductStatus,
        public createdBy?: string,
        public createdDate?: Moment,
        public lastModifiedBy?: string,
        public lastModifiedDate?: Moment,
        public styles?: IProductStyle[],
        public items?: IProductItem[],
        public shopId?: number,
        public categories?: ICategory[]
    ) {}
}
