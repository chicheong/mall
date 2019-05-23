import { Moment } from 'moment';

export const enum ProductStatus {
    ACTIVE = 'ACTIVE',
    RESTRICTED = 'RESTRICTED',
    INACTIVE = 'INACTIVE'
}

export interface IProductHistory {
    id?: number;
    productId?: number;
    name?: string;
    code?: string;
    brand?: string;
    description?: string;
    content?: string;
    remark?: string;
    status?: ProductStatus;
    createdBy?: string;
    createdDate?: Moment;
}

export class ProductHistory implements IProductHistory {
    constructor(
        public id?: number,
        public productId?: number,
        public name?: string,
        public code?: string,
        public brand?: string,
        public description?: string,
        public content?: string,
        public remark?: string,
        public status?: ProductStatus,
        public createdBy?: string,
        public createdDate?: Moment
    ) {}
}
