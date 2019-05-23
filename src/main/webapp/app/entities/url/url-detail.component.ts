import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUrl } from 'app/shared/model/url.model';

@Component({
    selector: 'jhi-url-detail',
    templateUrl: './url-detail.component.html'
})
export class UrlDetailComponent implements OnInit {
    url: IUrl;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ url }) => {
            this.url = url;
        });
    }

    previousState() {
        window.history.back();
    }
}
