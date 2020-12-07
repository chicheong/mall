import { Moment } from 'moment';

export interface IMyUrl {
  id?: number;
  entityType?: string;
  entityId?: number;
  path?: string;
  fileName?: string;
  sequence?: number;
  description?: string;
  createdBy?: string;
  createdDate?: Moment;
  lastModifiedBy?: string;
  lastModifiedDate?: Moment;
}

export class MyUrl implements IMyUrl {
  constructor(
    public id?: number,
    public entityType?: string,
    public entityId?: number,
    public path?: string,
    public fileName?: string,
    public sequence?: number,
    public description?: string,
    public createdBy?: string,
    public createdDate?: Moment,
    public lastModifiedBy?: string,
    public lastModifiedDate?: Moment
  ) {}
}
