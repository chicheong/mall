import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IOrderShop } from 'app/shared/model/order-shop.model';
import { OrderShopService } from './order-shop.service';

@Component({
    selector: 'jhi-order-shop-delete-dialog',
    templateUrl: './order-shop-delete-dialog.component.html'
})
export class OrderShopDeleteDialogComponent {
    orderShop: IOrderShop;

    constructor(
        protected orderShopService: OrderShopService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.orderShopService.delete(id).subscribe(response => {
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
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ orderShop }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(OrderShopDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.orderShop = orderShop;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/order-shop', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/order-shop', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
