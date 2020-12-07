import { Moment } from 'moment';
import { CurrencyType } from 'app/shared/model/enumerations/currency-type.model';

export interface ICurrencyRate {
  id?: number;
  from?: Moment;
  to?: Moment;
  rate?: number;
  sourceCurrency?: CurrencyType;
  targetCurrency?: CurrencyType;
}

export class CurrencyRate implements ICurrencyRate {
  constructor(
    public id?: number,
    public from?: Moment,
    public to?: Moment,
    public rate?: number,
    public sourceCurrency?: CurrencyType,
    public targetCurrency?: CurrencyType
  ) {}
}
