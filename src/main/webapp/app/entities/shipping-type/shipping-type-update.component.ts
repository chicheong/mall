import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IShippingType } from 'app/shared/model/shipping-type.model';
import { ShippingTypeService } from './shipping-type.service';

@Component({
    selector: 'jhi-shipping-type-update',
    templateUrl: './shipping-type-update.component.html'
})
export class ShippingTypeUpdateComponent implements OnInit {
    shippingType: IShippingType;
    isSaving: boolean;

    constructor(protected shippingTypeService: ShippingTypeService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ shippingType }) => {
            this.shippingType = shippingType;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.shippingType.id !== undefined) {
            this.subscribeToSaveResponse(this.shippingTypeService.update(this.shippingType));
        } else {
            this.subscribeToSaveResponse(this.shippingTypeService.create(this.shippingType));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IShippingType>>) {
        result.subscribe((res: HttpResponse<IShippingType>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
