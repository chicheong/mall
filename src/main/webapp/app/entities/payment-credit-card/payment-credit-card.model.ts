import { BaseEntity } from './../../shared';

export class PaymentCreditCard implements BaseEntity {
    constructor(
        public id?: number,
        public holderName?: string,
        public cardNumber?: string,
        public expirationMonth?: string,
        public expirationYear?: string,
        public cvc?: string,
        public payment?: BaseEntity,
        // For temporary storing expirationMonth and expirationYear
        public expiration?: string,
    ) {
    }
}
