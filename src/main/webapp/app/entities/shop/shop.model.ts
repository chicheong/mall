import { BaseEntity } from './../../shared';
import { Product } from './../product';

export const enum CommonStatus {
    'ACTIVE',
    'INACTIVE'
}

export class Shop implements BaseEntity {
    constructor(
        public id?: number,
        public code?: string,
        public name?: string,
        public description?: string,
        public status?: CommonStatus,
        public createdBy?: string,
        public createdDate?: any,
        public lastModifiedBy?: string,
        public lastModifiedDate?: any,
        public accounts?: BaseEntity[],
        public products?: Product[],
    ) {
    }
}
