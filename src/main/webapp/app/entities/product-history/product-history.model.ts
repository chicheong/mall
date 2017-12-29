import { BaseEntity } from './../../shared';

export const enum ProductStatus {
    'ACTIVE',
    'RESTRICTED',
    'INACTIVE'
}

export class ProductHistory implements BaseEntity {
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
        public createdDate?: any,
    ) {
    }
}
