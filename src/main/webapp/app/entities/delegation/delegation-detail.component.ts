import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDelegation } from 'app/shared/model/delegation.model';

@Component({
  selector: 'jhi-delegation-detail',
  templateUrl: './delegation-detail.component.html'
})
export class DelegationDetailComponent implements OnInit {
  delegation: IDelegation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ delegation }) => (this.delegation = delegation));
  }

  previousState(): void {
    window.history.back();
  }
}
