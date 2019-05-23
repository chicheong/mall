import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IShop } from 'app/shared/model/shop.model';
import { ShopService } from './shop.service';
import { IMyAccount } from 'app/shared/model/my-account.model';
import { MyAccountService } from 'app/entities/my-account';

@Component({
    selector: 'jhi-shop-update',
    templateUrl: './shop-update.component.html'
})
export class ShopUpdateComponent implements OnInit {
    shop: IShop;
    isSaving: boolean;

    myaccounts: IMyAccount[];
    createdDate: string;
    lastModifiedDate: string;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected shopService: ShopService,
        protected myAccountService: MyAccountService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ shop }) => {
            this.shop = shop;
            this.createdDate = this.shop.createdDate != null ? this.shop.createdDate.format(DATE_TIME_FORMAT) : null;
            this.lastModifiedDate = this.shop.lastModifiedDate != null ? this.shop.lastModifiedDate.format(DATE_TIME_FORMAT) : null;
        });
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
        this.shop.createdDate = this.createdDate != null ? moment(this.createdDate, DATE_TIME_FORMAT) : null;
        this.shop.lastModifiedDate = this.lastModifiedDate != null ? moment(this.lastModifiedDate, DATE_TIME_FORMAT) : null;
        if (this.shop.id !== undefined) {
            this.subscribeToSaveResponse(this.shopService.update(this.shop));
        } else {
            this.subscribeToSaveResponse(this.shopService.create(this.shop));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IShop>>) {
        result.subscribe((res: HttpResponse<IShop>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackMyAccountById(index: number, item: IMyAccount) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}
