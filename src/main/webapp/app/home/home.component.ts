import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Account, LoginModalService, Principal } from '../shared';

import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: [
        'home.scss'
    ]

})
export class HomeComponent implements OnInit {
    account: Account;
    modalRef: NgbModalRef;

    images: Array<string>;

    constructor(
        private principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
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
        this.registerAuthenticationSuccess();
    }

    private _randomImageUrls(images: Array<{id: number}>): Array<string> {
        return [1, 2, 3].map(() => {
          const randomId = images[Math.floor(Math.random() * images.length)].id;
          return `https://picsum.photos/900/500?image=${randomId}`;
        });
      }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', (message) => {
            // console.error('home subscribe authenticationSuccess');
            this.principal.identity().then((account) => {
                // console.error('home this.principal.identity().then');
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }
}
