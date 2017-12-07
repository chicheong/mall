import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Delegation } from './delegation.model';
import { DelegationPopupService } from './delegation-popup.service';
import { DelegationService } from './delegation.service';

@Component({
    selector: 'jhi-delegation-delete-dialog',
    templateUrl: './delegation-delete-dialog.component.html'
})
export class DelegationDeleteDialogComponent {

    delegation: Delegation;

    constructor(
        private delegationService: DelegationService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.delegationService.delete(id).subscribe((response) => {
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

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private delegationPopupService: DelegationPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.delegationPopupService
                .open(DelegationDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
