import { BaseEntity } from './../../shared';

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
        public items?: BaseEntity[],
        public histories?: BaseEntity[],
        public userInfoId?: number,
        public categories?: BaseEntity[],
    ) {
    }
}
