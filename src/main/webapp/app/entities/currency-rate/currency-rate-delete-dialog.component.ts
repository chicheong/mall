import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICurrencyRate } from 'app/shared/model/currency-rate.model';
import { CurrencyRateService } from './currency-rate.service';

@Component({
    selector: 'jhi-currency-rate-delete-dialog',
    templateUrl: './currency-rate-delete-dialog.component.html'
})
export class CurrencyRateDeleteDialogComponent {
    currencyRate: ICurrencyRate;

    constructor(
        protected currencyRateService: CurrencyRateService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.currencyRateService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'currencyRateListModification',
                content: 'Deleted an currencyRate'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-currency-rate-delete-popup',
    template: ''
})
export class CurrencyRateDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ currencyRate }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(CurrencyRateDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.currencyRate = currencyRate;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/currency-rate', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/currency-rate', { outlets: { popup: null } }]);
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
