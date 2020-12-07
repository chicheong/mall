import { IShop } from 'app/shared/model/shop.model';
import { ShippingPriceRuleType } from 'app/shared/model/enumerations/shipping-price-rule-type.model';

export interface IShippingPriceRule {
  id?: number;
  type?: ShippingPriceRuleType;
  value?: number;
  price?: number;
  sequence?: number;
  shop?: IShop;
}

export class ShippingPriceRule implements IShippingPriceRule {
  constructor(
    public id?: number,
    public type?: ShippingPriceRuleType,
    public value?: number,
    public price?: number,
    public sequence?: number,
    public shop?: IShop
  ) {}
}
