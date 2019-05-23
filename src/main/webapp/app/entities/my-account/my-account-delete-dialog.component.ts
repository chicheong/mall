import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IMyAccount } from 'app/shared/model/my-account.model';
import { MyAccountService } from './my-account.service';

@Component({
    selector: 'jhi-my-account-delete-dialog',
    templateUrl: './my-account-delete-dialog.component.html'
})
export class MyAccountDeleteDialogComponent {
    myAccount: IMyAccount;

    constructor(
        protected myAccountService: MyAccountService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.myAccountService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'myAccountListModification',
                content: 'Deleted an myAccount'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-my-account-delete-popup',
    template: ''
})
export class MyAccountDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ myAccount }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(MyAccountDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.myAccount = myAccount;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/my-account', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/my-account', { outlets: { popup: null } }]);
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
