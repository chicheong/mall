import { BaseEntity } from './../../shared';

export class CreditCard implements BaseEntity {
    constructor(
        public id?: number,
        public holderName?: string,
        public cardNumber?: string,
        public expirationMonth?: string,
        public expirationYear?: string,
        public cvc?: string,
        public account?: BaseEntity,
    ) {
    }
}
