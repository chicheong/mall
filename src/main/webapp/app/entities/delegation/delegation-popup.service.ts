import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Delegation } from './delegation.model';
import { DelegationService } from './delegation.service';

@Injectable()
export class DelegationPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private delegationService: DelegationService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.delegationService.find(id)
                    .subscribe((delegationResponse: HttpResponse<Delegation>) => {
                        const delegation: Delegation = delegationResponse.body;
                        delegation.from = this.datePipe
                            .transform(delegation.from, 'yyyy-MM-ddTHH:mm:ss');
                        delegation.to = this.datePipe
                            .transform(delegation.to, 'yyyy-MM-ddTHH:mm:ss');
                        delegation.createdDate = this.datePipe
                            .transform(delegation.createdDate, 'yyyy-MM-ddTHH:mm:ss');
                        delegation.lastModifiedDate = this.datePipe
                            .transform(delegation.lastModifiedDate, 'yyyy-MM-ddTHH:mm:ss');
                        this.ngbModalRef = this.delegationModalRef(component, delegation);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.delegationModalRef(component, new Delegation());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    delegationModalRef(component: Component, delegation: Delegation): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.delegation = delegation;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
