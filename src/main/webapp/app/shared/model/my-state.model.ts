import { ICountry } from 'app/shared/model/country.model';

export interface IMyState {
  id?: number;
  code?: string;
  label?: string;
  name?: string;
  country?: ICountry;
}

export class MyState implements IMyState {
  constructor(public id?: number, public code?: string, public label?: string, public name?: string, public country?: ICountry) {}
}
