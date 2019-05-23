import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPaymentCard } from 'app/shared/model/payment-card.model';
import { PaymentCardService } from './payment-card.service';

@Component({
    selector: 'jhi-payment-card-delete-dialog',
    templateUrl: './payment-card-delete-dialog.component.html'
})
export class PaymentCardDeleteDialogComponent {
    paymentCard: IPaymentCard;

    constructor(
        protected paymentCardService: PaymentCardService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.paymentCardService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'paymentCardListModification',
                content: 'Deleted an paymentCard'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-payment-card-delete-popup',
    template: ''
})
export class PaymentCardDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ paymentCard }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(PaymentCardDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.paymentCard = paymentCard;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/payment-card', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/payment-card', { outlets: { popup: null } }]);
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
