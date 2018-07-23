import { Component, OnInit, OnDestroy } from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

import { BannerService } from './banner.service';

@Component({
    selector: 'jhi-home-banner',
    templateUrl: './home-banner.component.html'
})
export class HomeBannerComponent implements OnInit, OnDestroy {

    images: Array<string>;

    constructor(
        private bannerService: BannerService,
        private _http: HttpClient
    ) {
    }

    ngOnInit() {
        // this._http.get('https://picsum.photos/list')
        // .pipe(map((images: Array<{id: number}>) => this._randomImageUrls(images)))
        // .subscribe((images) => this.images = images);

        this.images = ['http://placehold.it/1900x1080&amp;text=Slide One',
                       'https://www.w3schools.com/bootstrap/chicago.jpg',
                       'http://placehold.it/1900x1080&amp;text=Slide Three'];
    }

    private _randomImageUrls(images: Array<{id: number}>): Array<string> {
        return [1, 2, 3].map(() => {
          const randomId = images[Math.floor(Math.random() * images.length)].id;
          return `https://picsum.photos/900/500?image=${randomId}`;
        });
    }

    ngOnDestroy() {
    }
}
