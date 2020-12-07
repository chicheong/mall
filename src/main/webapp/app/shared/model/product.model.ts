import { Moment } from 'moment';
import { IProductStyle } from 'app/shared/model/product-style.model';
import { IProductItem } from 'app/shared/model/product-item.model';
import { ICategory } from 'app/shared/model/category.model';
import { IMyUrl } from 'app/shared/model/my-url.model';
import { ProductStatus } from 'app/shared/model/enumerations/product-status.model';

export interface IProduct {
    id?: number;
    name?: string;
    code?: string;
    brand?: string;
    description?: string;
    content?: string;
    remark?: string;
    status?: ProductStatus;
    permission?: string;
    createdBy?: string;
    createdDate?: Moment;
    lastModifiedBy?: string;
    lastModifiedDate?: Moment;
    colors?: IProductStyle[];
    sizes?: IProductStyle[];
    items?: IProductItem[];
    shopId?: number;
    categories?: ICategory[];
    urls?: IMyUrl[];
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
        public permission?: string,
        public createdBy?: string,
        public createdDate?: Moment,
        public lastModifiedBy?: string,
        public lastModifiedDate?: Moment,
        public colors?: IProductStyle[],
        public sizes?: IProductStyle[],
        public items?: IProductItem[],
        public shopId?: number,
        public categories?: ICategory[],
        public urls?: IMyUrl[]
    ) {}
}
