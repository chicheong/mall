import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { ProductStyle } from './product-style.model';
import { ProductStyleService } from './product-style.service';

@Component({
    selector: 'jhi-product-style-detail',
    templateUrl: './product-style-detail.component.html'
})
export class ProductStyleDetailComponent implements OnInit, OnDestroy {

    productStyle: ProductStyle;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private productStyleService: ProductStyleService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInProductStyles();
    }

    load(id) {
        this.productStyleService.find(id)
            .subscribe((productStyleResponse: HttpResponse<ProductStyle>) => {
                this.productStyle = productStyleResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInProductStyles() {
        this.eventSubscriber = this.eventManager.subscribe(
            'productStyleListModification',
            (response) => this.load(this.productStyle.id)
        );
    }
}
