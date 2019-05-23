import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IUrl } from 'app/shared/model/url.model';
import { UrlService } from './url.service';

@Component({
    selector: 'jhi-url-delete-dialog',
    templateUrl: './url-delete-dialog.component.html'
})
export class UrlDeleteDialogComponent {
    url: IUrl;

    constructor(protected urlService: UrlService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.urlService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'urlListModification',
                content: 'Deleted an url'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-url-delete-popup',
    template: ''
})
export class UrlDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ url }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(UrlDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.url = url;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/url', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/url', { outlets: { popup: null } }]);
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
