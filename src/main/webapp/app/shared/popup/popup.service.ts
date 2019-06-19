import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Injectable({ providedIn: 'root' })
export class PopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, object?: Object, broadcastName?: string, type?: string): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (object instanceof Object) {
                this.ngbModalRef = this.modalRef(component, object, broadcastName, type);
                resolve(this.ngbModalRef);
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.modalRef(component, null, null, null);
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    modalRef(component: Component, object: Object, broadcastName: string, type: string): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.object = object;
        modalRef.componentInstance.broadcastName = broadcastName;
        modalRef.componentInstance.type = type;
        modalRef.result.then(result => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, reason => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
