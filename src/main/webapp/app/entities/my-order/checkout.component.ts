import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

import { IMyOrder } from 'app/shared/model/my-order.model';
import { MyOrderService } from './my-order.service';

@Component({
    selector: 'jhi-checkout',
    templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit {

    myOrder: IMyOrder | null = null;
    isSaving = false;
    
    isLinear = false;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;

    constructor(
        private myOrderService: MyOrderService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private _formBuilder: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe(({ myOrder }) => (this.myOrder = myOrder));
        this.firstFormGroup = this._formBuilder.group({
            firstCtrl: ['', Validators.required]
        });
        this.secondFormGroup = this._formBuilder.group({
            secondCtrl: ['', Validators.required]
        });
    }

    previousState(): void {
//        this.save();
        window.history.back();
    }
}
