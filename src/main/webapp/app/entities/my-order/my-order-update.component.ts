import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IMyOrder, MyOrder } from 'app/shared/model/my-order.model';
import { MyOrderService } from './my-order.service';
import { IContact } from 'app/shared/model/contact.model';
import { ContactService } from 'app/entities/contact/contact.service';
import { IMyAccount } from 'app/shared/model/my-account.model';
import { MyAccountService } from 'app/entities/my-account/my-account.service';

type SelectableEntity = IContact | IMyAccount;

@Component({
  selector: 'jhi-my-order-update',
  templateUrl: './my-order-update.component.html'
})
export class MyOrderUpdateComponent implements OnInit {
  isSaving = false;
  shippings: IContact[] = [];
  billings: IContact[] = [];
  myaccounts: IMyAccount[] = [];

  editForm = this.fb.group({
    id: [],
    total: [],
    currency: [],
    remark: [],
    status: [],
    shipping: [],
    billing: [],
    accountId: []
  });

  constructor(
    protected myOrderService: MyOrderService,
    protected contactService: ContactService,
    protected myAccountService: MyAccountService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ myOrder }) => {
      this.updateForm(myOrder);

      this.contactService
        .query({ filter: 'myorder-is-null' })
        .pipe(
          map((res: HttpResponse<IContact[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IContact[]) => {
          if (!myOrder.shippingId) {
            this.shippings = resBody;
          } else {
            this.contactService
              .find(myOrder.shippingId)
              .pipe(
                map((subRes: HttpResponse<IContact>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IContact[]) => (this.shippings = concatRes));
          }
        });

      this.contactService
        .query({ filter: 'myorder-is-null' })
        .pipe(
          map((res: HttpResponse<IContact[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IContact[]) => {
          if (!myOrder.billingId) {
            this.billings = resBody;
          } else {
            this.contactService
              .find(myOrder.billingId)
              .pipe(
                map((subRes: HttpResponse<IContact>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IContact[]) => (this.billings = concatRes));
          }
        });

      this.myAccountService.query().subscribe((res: HttpResponse<IMyAccount[]>) => (this.myaccounts = res.body || []));
    });
  }

  updateForm(myOrder: IMyOrder): void {
    this.editForm.patchValue({
      id: myOrder.id,
      total: myOrder.total,
      currency: myOrder.currency,
      remark: myOrder.remark,
      status: myOrder.status,
      shipping: myOrder.shipping,
      billing: myOrder.billing,
      accountId: myOrder.accountId
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const myOrder = this.createFromForm();
    if (myOrder.id !== undefined) {
      this.subscribeToSaveResponse(this.myOrderService.update(myOrder));
    } else {
      this.subscribeToSaveResponse(this.myOrderService.create(myOrder));
    }
  }

  private createFromForm(): IMyOrder {
    return {
      ...new MyOrder(),
      id: this.editForm.get(['id'])!.value,
      total: this.editForm.get(['total'])!.value,
      currency: this.editForm.get(['currency'])!.value,
      remark: this.editForm.get(['remark'])!.value,
      status: this.editForm.get(['status'])!.value,
      shipping: this.editForm.get(['shipping'])!.value,
      billing: this.editForm.get(['billing'])!.value,
      accountId: this.editForm.get(['accountId'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMyOrder>>): void {
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

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }
}
