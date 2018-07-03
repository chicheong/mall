import { BaseEntity } from './../../shared';
import { CurrencyType } from './../price';

export class CurrencyRate implements BaseEntity {
    constructor(
        public id?: number,
        public from?: any,
        public to?: any,
        public rate?: number,
        public sourceCurrency?: CurrencyType,
        public targetCurrency?: CurrencyType,
    ) {
    }
}
