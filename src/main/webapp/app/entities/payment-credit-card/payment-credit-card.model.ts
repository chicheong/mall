import { BaseEntity } from './../../shared';

export class PaymentCreditCard implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public value?: string,
        public holderName?: string,
        public expireDate?: any,
        public payment?: BaseEntity,
    ) {
    }
}
