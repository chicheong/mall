import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IDelegation, Delegation } from 'app/shared/model/delegation.model';
import { DelegationService } from './delegation.service';
import { IMyAccount } from 'app/shared/model/my-account.model';
import { MyAccountService } from 'app/entities/my-account/my-account.service';

@Component({
  selector: 'jhi-delegation-update',
  templateUrl: './delegation-update.component.html'
})
export class DelegationUpdateComponent implements OnInit {
  isSaving = false;
  myaccounts: IMyAccount[] = [];

  editForm = this.fb.group({
    id: [],
    from: [],
    to: [],
    type: [],
    delegateId: [],
    status: [],
    createdBy: [],
    createdDate: [],
    lastModifiedBy: [],
    lastModifiedDate: [],
    account: []
  });

  constructor(
    protected delegationService: DelegationService,
    protected myAccountService: MyAccountService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ delegation }) => {
      if (!delegation.id) {
        const today = moment().startOf('day');
        delegation.from = today;
        delegation.to = today;
        delegation.createdDate = today;
        delegation.lastModifiedDate = today;
      }

      this.updateForm(delegation);

      this.myAccountService.query().subscribe((res: HttpResponse<IMyAccount[]>) => (this.myaccounts = res.body || []));
    });
  }

  updateForm(delegation: IDelegation): void {
    this.editForm.patchValue({
      id: delegation.id,
      from: delegation.from ? delegation.from.format(DATE_TIME_FORMAT) : null,
      to: delegation.to ? delegation.to.format(DATE_TIME_FORMAT) : null,
      type: delegation.type,
      delegateId: delegation.delegateId,
      status: delegation.status,
      createdBy: delegation.createdBy,
      createdDate: delegation.createdDate ? delegation.createdDate.format(DATE_TIME_FORMAT) : null,
      lastModifiedBy: delegation.lastModifiedBy,
      lastModifiedDate: delegation.lastModifiedDate ? delegation.lastModifiedDate.format(DATE_TIME_FORMAT) : null,
      account: delegation.account
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const delegation = this.createFromForm();
    if (delegation.id !== undefined) {
      this.subscribeToSaveResponse(this.delegationService.update(delegation));
    } else {
      this.subscribeToSaveResponse(this.delegationService.create(delegation));
    }
  }

  private createFromForm(): IDelegation {
    return {
      ...new Delegation(),
      id: this.editForm.get(['id'])!.value,
      from: this.editForm.get(['from'])!.value ? moment(this.editForm.get(['from'])!.value, DATE_TIME_FORMAT) : undefined,
      to: this.editForm.get(['to'])!.value ? moment(this.editForm.get(['to'])!.value, DATE_TIME_FORMAT) : undefined,
      type: this.editForm.get(['type'])!.value,
      delegateId: this.editForm.get(['delegateId'])!.value,
      status: this.editForm.get(['status'])!.value,
      createdBy: this.editForm.get(['createdBy'])!.value,
      createdDate: this.editForm.get(['createdDate'])!.value
        ? moment(this.editForm.get(['createdDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      lastModifiedBy: this.editForm.get(['lastModifiedBy'])!.value,
      lastModifiedDate: this.editForm.get(['lastModifiedDate'])!.value
        ? moment(this.editForm.get(['lastModifiedDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      account: this.editForm.get(['account'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDelegation>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: IMyAccount): any {
    return item.id;
  }
}
