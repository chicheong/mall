import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { IPrice } from 'app/shared/model/price.model';
import { IProductItem, ProductItem } from 'app/shared/model/product-item.model';

@Injectable({ providedIn: 'root' })
export class PricesPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, item?: IProductItem, broadcastName?: string): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (item) {
                // price.from = this.datePipe.transform(price.from, 'yyyy-MM-ddTHH:mm:ss');
                // price.to = this.datePipe.transform(price.to, 'yyyy-MM-ddTHH:mm:ss');
                this.ngbModalRef = this.priceModalRef(component, item, broadcastName);
                resolve(this.ngbModalRef);
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.priceModalRef(component, new ProductItem(), broadcastName);
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    priceModalRef(component: Component, item: IProductItem, broadcastName: string): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.productItem = item;
        modalRef.componentInstance.broadcastName = broadcastName;
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
