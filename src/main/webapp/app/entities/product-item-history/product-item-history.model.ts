import { BaseEntity } from './../../shared';
import { CurrencyType } from './../price';

export class ProductItemHistory implements BaseEntity {
    constructor(
        public id?: number,
        public code?: string,
        public isDefault?: boolean,
        public quantity?: number,
        public currency?: CurrencyType,
        public price?: number,
        public createdBy?: string,
        public createdDate?: any,
    ) {
        this.isDefault = false;
    }
}
