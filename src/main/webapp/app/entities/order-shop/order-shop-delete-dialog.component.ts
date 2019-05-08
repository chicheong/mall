import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { OrderShop } from './order-shop.model';
import { OrderShopPopupService } from './order-shop-popup.service';
import { OrderShopService } from './order-shop.service';

@Component({
    selector: 'jhi-order-shop-delete-dialog',
    templateUrl: './order-shop-delete-dialog.component.html'
})
export class OrderShopDeleteDialogComponent {

    orderShop: OrderShop;

    constructor(
        private orderShopService: OrderShopService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.orderShopService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'orderShopListModification',
                content: 'Deleted an orderShop'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-order-shop-delete-popup',
    template: ''
})
export class OrderShopDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private orderShopPopupService: OrderShopPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.orderShopPopupService
                .open(OrderShopDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
