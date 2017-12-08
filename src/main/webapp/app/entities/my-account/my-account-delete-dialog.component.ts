import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { MyAccount } from './my-account.model';
import { MyAccountPopupService } from './my-account-popup.service';
import { MyAccountService } from './my-account.service';

@Component({
    selector: 'jhi-my-account-delete-dialog',
    templateUrl: './my-account-delete-dialog.component.html'
})
export class MyAccountDeleteDialogComponent {

    myAccount: MyAccount;

    constructor(
        private myAccountService: MyAccountService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.myAccountService.delete(id).subscribe((response) => {
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

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private myAccountPopupService: MyAccountPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.myAccountPopupService
                .open(MyAccountDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
