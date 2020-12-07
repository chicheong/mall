import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMyUrl } from 'app/shared/model/my-url.model';

@Component({
  selector: 'jhi-url-detail',
  templateUrl: './my-url-detail.component.html'
})
export class MyUrlDetailComponent implements OnInit {
  url: IMyUrl | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ url }) => (this.url = url));
  }

  previousState(): void {
    window.history.back();
  }
}
