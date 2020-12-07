import { ModalResultType } from 'app/shared/model/enumerations/modal-result-type.model';

export interface IModalResult {
  type?: ModalResultType;
  obj?: any;
}

export class ModalResult implements IModalResult {
  constructor(
    public type?: ModalResultType,
    public obj?: any
  ) {}
}
