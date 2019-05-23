import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IDelegation } from 'app/shared/model/delegation.model';
import { DelegationService } from './delegation.service';

@Component({
    selector: 'jhi-delegation-delete-dialog',
    templateUrl: './delegation-delete-dialog.component.html'
})
export class DelegationDeleteDialogComponent {
    delegation: IDelegation;

    constructor(
        protected delegationService: DelegationService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.delegationService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'delegationListModification',
                content: 'Deleted an delegation'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-delegation-delete-popup',
    template: ''
})
export class DelegationDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ delegation }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(DelegationDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.delegation = delegation;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/delegation', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/delegation', { outlets: { popup: null } }]);
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
