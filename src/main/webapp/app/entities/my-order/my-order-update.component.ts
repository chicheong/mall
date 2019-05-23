import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IMyOrder } from 'app/shared/model/my-order.model';
import { MyOrderService } from './my-order.service';
import { IAddress } from 'app/shared/model/address.model';
import { AddressService } from 'app/entities/address';
import { IMyAccount } from 'app/shared/model/my-account.model';
import { MyAccountService } from 'app/entities/my-account';

@Component({
    selector: 'jhi-my-order-update',
    templateUrl: './my-order-update.component.html'
})
export class MyOrderUpdateComponent implements OnInit {
    myOrder: IMyOrder;
    isSaving: boolean;

    shippingaddresses: IAddress[];

    billingaddresses: IAddress[];

    myaccounts: IMyAccount[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected myOrderService: MyOrderService,
        protected addressService: AddressService,
        protected myAccountService: MyAccountService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ myOrder }) => {
            this.myOrder = myOrder;
        });
        this.addressService
            .query({ filter: 'myorder-is-null' })
            .pipe(
                filter((mayBeOk: HttpResponse<IAddress[]>) => mayBeOk.ok),
                map((response: HttpResponse<IAddress[]>) => response.body)
            )
            .subscribe(
                (res: IAddress[]) => {
                    if (!this.myOrder.shippingAddressId) {
                        this.shippingaddresses = res;
                    } else {
                        this.addressService
                            .find(this.myOrder.shippingAddressId)
                            .pipe(
                                filter((subResMayBeOk: HttpResponse<IAddress>) => subResMayBeOk.ok),
                                map((subResponse: HttpResponse<IAddress>) => subResponse.body)
                            )
                            .subscribe(
                                (subRes: IAddress) => (this.shippingaddresses = [subRes].concat(res)),
                                (subRes: HttpErrorResponse) => this.onError(subRes.message)
                            );
                    }
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        this.addressService
            .query({ filter: 'myorder-is-null' })
            .pipe(
                filter((mayBeOk: HttpResponse<IAddress[]>) => mayBeOk.ok),
                map((response: HttpResponse<IAddress[]>) => response.body)
            )
            .subscribe(
                (res: IAddress[]) => {
                    if (!this.myOrder.billingAddressId) {
                        this.billingaddresses = res;
                    } else {
                        this.addressService
                            .find(this.myOrder.billingAddressId)
                            .pipe(
                                filter((subResMayBeOk: HttpResponse<IAddress>) => subResMayBeOk.ok),
                                map((subResponse: HttpResponse<IAddress>) => subResponse.body)
                            )
                            .subscribe(
                                (subRes: IAddress) => (this.billingaddresses = [subRes].concat(res)),
                                (subRes: HttpErrorResponse) => this.onError(subRes.message)
                            );
                    }
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        this.myAccountService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IMyAccount[]>) => mayBeOk.ok),
                map((response: HttpResponse<IMyAccount[]>) => response.body)
            )
            .subscribe((res: IMyAccount[]) => (this.myaccounts = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.myOrder.id !== undefined) {
            this.subscribeToSaveResponse(this.myOrderService.update(this.myOrder));
        } else {
            this.subscribeToSaveResponse(this.myOrderService.create(this.myOrder));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IMyOrder>>) {
        result.subscribe((res: HttpResponse<IMyOrder>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackAddressById(index: number, item: IAddress) {
        return item.id;
    }

    trackMyAccountById(index: number, item: IMyAccount) {
        return item.id;
    }
}
