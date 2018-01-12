import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Price } from '../price';
import { ProductItem } from '../product-item';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-price-dialog',
    templateUrl: './prices-dialog.component.html'
})
export class PricesDialogComponent implements OnInit {

    public editForm: FormGroup;
    item: ProductItem;
    isSaving: boolean;

    productitems: ProductItem[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private _fb: FormBuilder
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        
        this.editForm = this._fb.group({
            // name: ['', [Validators.required, Validators.minLength(5)]],
            prices: this._fb.array([])
        });
        
        // add price
        this.addPrice();
    }
    
    initPrice() {
        return this._fb.group({
            street: ['', Validators.required],
            postcode: ['']
        });
    }

    addPrice() {
        const control = <FormArray>this.myForm.controls['prices'];
        const addrCtrl = this.initPrice();
        
        control.push(addrCtrl);
        
        /* subscribe to individual address value changes */
        // addrCtrl.valueChanges.subscribe(x => {
        //   console.log(x);
        // })
    }

    removePrice(i: number) {
        const control = <FormArray>this.myForm.controls['prices'];
        control.removeAt(i);
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        this.eventManager.broadcast({ name: 'priceListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss('OK');
    }

    trackProductItemById(index: number, item: ProductItem) {
        return item.id;
    }
}
