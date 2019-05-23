import { Moment } from 'moment';
import { ICategory } from 'app/shared/model/category.model';
import { IProduct } from 'app/shared/model/product.model';

export const enum CategoryStatus {
    ACTIVE = 'ACTIVE',
    RESTRICTED = 'RESTRICTED',
    INACTIVE = 'INACTIVE'
}

export interface ICategory {
    id?: number;
    name?: string;
    description?: string;
    status?: CategoryStatus;
    createdBy?: string;
    createdDate?: Moment;
    lastModifiedBy?: string;
    lastModifiedDate?: Moment;
    parent?: ICategory;
    products?: IProduct[];
}

export class Category implements ICategory {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public status?: CategoryStatus,
        public createdBy?: string,
        public createdDate?: Moment,
        public lastModifiedBy?: string,
        public lastModifiedDate?: Moment,
        public parent?: ICategory,
        public products?: IProduct[]
    ) {}
}
