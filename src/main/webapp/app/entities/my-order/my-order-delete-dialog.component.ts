import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { MyOrder } from './my-order.model';
import { MyOrderPopupService } from './my-order-popup.service';
import { MyOrderService } from './my-order.service';

@Component({
    selector: 'jhi-my-order-delete-dialog',
    templateUrl: './my-order-delete-dialog.component.html'
})
export class MyOrderDeleteDialogComponent {

    myOrder: MyOrder;

    constructor(
        private myOrderService: MyOrderService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.myOrderService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'myOrderListModification',
                content: 'Deleted an myOrder'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-my-order-delete-popup',
    template: ''
})
export class MyOrderDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private myOrderPopupService: MyOrderPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.myOrderPopupService
                .open(MyOrderDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
