import { CartControlType } from './cart-control-type';

export class CartControl {
    billingControl = CartControlType.HIDE;
    paymentControl = CartControlType.HIDE;
    reviewControl = CartControlType.HIDE;
    methodControl = CartControlType.HIDE;
    shippingControl = CartControlType.HIDE;
}
