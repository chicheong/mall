import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IMyState } from 'app/shared/model/my-state.model';
import { MyStateService } from './my-state.service';

@Component({
    selector: 'jhi-my-state-delete-dialog',
    templateUrl: './my-state-delete-dialog.component.html'
})
export class MyStateDeleteDialogComponent {
    myState: IMyState;

    constructor(protected myStateService: MyStateService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.myStateService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'myStateListModification',
                content: 'Deleted an myState'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-my-state-delete-popup',
    template: ''
})
export class MyStateDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ myState }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(MyStateDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.myState = myState;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/my-state', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/my-state', { outlets: { popup: null } }]);
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
