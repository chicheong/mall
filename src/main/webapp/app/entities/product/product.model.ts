import { BaseEntity } from './../../shared';
import { ProductItem } from './../product-item';

export const enum ProductStatus {
    'ACTIVE',
    'RESTRICTED',
    'INACTIVE'
}

export class Product implements BaseEntity {
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
        public createdDate?: any,
        public lastModifiedBy?: string,
        public lastModifiedDate?: any,
        public items?: ProductItem[],
        public histories?: BaseEntity[],
        public shopId?: number,
        public categories?: BaseEntity[],
    ) {
    }
}
