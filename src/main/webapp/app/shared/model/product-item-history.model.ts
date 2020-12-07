import { Moment } from 'moment';
import { CurrencyType } from 'app/shared/model/enumerations/currency-type.model';

export interface IProductItemHistory {
  id?: number;
  code?: string;
  isDefault?: boolean;
  quantity?: number;
  currency?: CurrencyType;
  price?: number;
  createdBy?: string;
  createdDate?: Moment;
}

export class ProductItemHistory implements IProductItemHistory {
  constructor(
    public id?: number,
    public code?: string,
    public isDefault?: boolean,
    public quantity?: number,
    public currency?: CurrencyType,
    public price?: number,
    public createdBy?: string,
    public createdDate?: Moment
  ) {
    this.isDefault = this.isDefault || false;
  }
}
