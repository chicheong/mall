import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IShipping } from 'app/shared/model/shipping.model';
import { ShippingService } from './shipping.service';
import { IShippingType } from 'app/shared/model/shipping-type.model';
import { ShippingTypeService } from 'app/entities/shipping-type';

@Component({
    selector: 'jhi-shipping-update',
    templateUrl: './shipping-update.component.html'
})
export class ShippingUpdateComponent implements OnInit {
    shipping: IShipping;
    isSaving: boolean;

    shippingtypes: IShippingType[];
    date: string;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected shippingService: ShippingService,
        protected shippingTypeService: ShippingTypeService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ shipping }) => {
            this.shipping = shipping;
            this.date = this.shipping.date != null ? this.shipping.date.format(DATE_TIME_FORMAT) : null;
        });
        this.shippingTypeService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IShippingType[]>) => mayBeOk.ok),
                map((response: HttpResponse<IShippingType[]>) => response.body)
            )
            .subscribe((res: IShippingType[]) => (this.shippingtypes = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.shipping.date = this.date != null ? moment(this.date, DATE_TIME_FORMAT) : null;
        if (this.shipping.id !== undefined) {
            this.subscribeToSaveResponse(this.shippingService.update(this.shipping));
        } else {
            this.subscribeToSaveResponse(this.shippingService.create(this.shipping));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IShipping>>) {
        result.subscribe((res: HttpResponse<IShipping>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackShippingTypeById(index: number, item: IShippingType) {
        return item.id;
    }
}
