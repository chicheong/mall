import { CartControlType } from './cart-control-type';

export class CartControl {
    billingInfoControl = CartControlType.HIDE;
    paymentControl = CartControlType.HIDE;
    reviewCartControl = CartControlType.HIDE;
    shippingControl = CartControlType.HIDE;
    shippingInfoControl = CartControlType.HIDE;
}
