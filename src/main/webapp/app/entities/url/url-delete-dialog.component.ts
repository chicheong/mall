import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Url } from './url.model';
import { UrlPopupService } from './url-popup.service';
import { UrlService } from './url.service';

@Component({
    selector: 'jhi-url-delete-dialog',
    templateUrl: './url-delete-dialog.component.html'
})
export class UrlDeleteDialogComponent {

    url: Url;

    constructor(
        private urlService: UrlService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.urlService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'urlListModification',
                content: 'Deleted an url'
            });
            this.activeModal.dismiss(true);
        });
    }

    delete() {
        this.eventManager.broadcast({ name: 'deleteUrlModification', content: 'Deleted an url', obj: this.url});
        this.activeModal.dismiss(true);
    }
}

@Component({
    selector: 'jhi-url-delete-popup',
    template: ''
})
export class UrlDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private urlPopupService: UrlPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.urlPopupService
                .open(UrlDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
