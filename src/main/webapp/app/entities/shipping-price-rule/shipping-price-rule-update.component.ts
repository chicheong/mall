import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IShippingPriceRule } from 'app/shared/model/shipping-price-rule.model';
import { ShippingPriceRuleService } from './shipping-price-rule.service';
import { IShop } from 'app/shared/model/shop.model';
import { ShopService } from 'app/entities/shop';

@Component({
    selector: 'jhi-shipping-price-rule-update',
    templateUrl: './shipping-price-rule-update.component.html'
})
export class ShippingPriceRuleUpdateComponent implements OnInit {
    shippingPriceRule: IShippingPriceRule;
    isSaving: boolean;

    shops: IShop[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected shippingPriceRuleService: ShippingPriceRuleService,
        protected shopService: ShopService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ shippingPriceRule }) => {
            this.shippingPriceRule = shippingPriceRule;
        });
        this.shopService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IShop[]>) => mayBeOk.ok),
                map((response: HttpResponse<IShop[]>) => response.body)
            )
            .subscribe((res: IShop[]) => (this.shops = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.shippingPriceRule.id !== undefined) {
            this.subscribeToSaveResponse(this.shippingPriceRuleService.update(this.shippingPriceRule));
        } else {
            this.subscribeToSaveResponse(this.shippingPriceRuleService.create(this.shippingPriceRule));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IShippingPriceRule>>) {
        result.subscribe((res: HttpResponse<IShippingPriceRule>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackShopById(index: number, item: IShop) {
        return item.id;
    }
}
