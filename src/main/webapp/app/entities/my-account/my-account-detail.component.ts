import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMyAccount } from 'app/shared/model/my-account.model';

@Component({
  selector: 'jhi-my-account-detail',
  templateUrl: './my-account-detail.component.html'
})
export class MyAccountDetailComponent implements OnInit {
  myAccount: IMyAccount | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ myAccount }) => (this.myAccount = myAccount));
  }

  previousState(): void {
    window.history.back();
  }
}
