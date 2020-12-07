import { IPayment } from 'app/shared/model/payment.model';

export interface IPaymentCard {
  id?: number;
  holderName?: string;
  cardNumber?: string;
  expirationMonth?: string;
  expirationYear?: string;
  cvc?: string;
  payment?: IPayment;
  expiration?: string;
}

export class PaymentCard implements IPaymentCard {
  constructor(
    public id?: number,
    public holderName?: string,
    public cardNumber?: string,
    public expirationMonth?: string,
    public expirationYear?: string,
    public cvc?: string,
    public payment?: IPayment,
    // For temporary storing expirationMonth and expirationYear
    public expiration?: string
  ) {}
}
