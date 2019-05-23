import { IMyAccount } from 'app/shared/model/my-account.model';

export interface ICard {
    id?: number;
    holderName?: string;
    cardNumber?: string;
    expirationMonth?: string;
    expirationYear?: string;
    cvc?: string;
    account?: IMyAccount;
}

export class Card implements ICard {
    constructor(
        public id?: number,
        public holderName?: string,
        public cardNumber?: string,
        public expirationMonth?: string,
        public expirationYear?: string,
        public cvc?: string,
        public account?: IMyAccount
    ) {}
}
