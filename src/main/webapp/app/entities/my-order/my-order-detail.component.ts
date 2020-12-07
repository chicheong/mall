import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMyOrder } from 'app/shared/model/my-order.model';

@Component({
  selector: 'jhi-my-order-detail',
  templateUrl: './my-order-detail.component.html'
})
export class MyOrderDetailComponent implements OnInit {
  myOrder: IMyOrder | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ myOrder }) => (this.myOrder = myOrder));
  }

  previousState(): void {
    window.history.back();
  }

// May not be in use
    updateMyOrder(): void {
    }

    checkout(): void {
//        console.log('calling checkout');
//        this.save();
//        this.router.navigate(['/checkout', this.myOrder.id]);
    }

    canCheckout(): void {
        if (this.myOrder && this.myOrder.shops && this.myOrder.shops.length > 0) {
            return; // true
        } else {
            return; // false
        }
    }
}
