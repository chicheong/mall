import { CurrencyType } from 'app/shared/model/enumerations/currency-type.model';

export interface IShippingType {
  id?: number;
  name?: string;
  description?: string;
  price?: number;
  currency?: CurrencyType;
}

export class ShippingType implements IShippingType {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public price?: number,
    public currency?: CurrencyType
  ) {}
}
