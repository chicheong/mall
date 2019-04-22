import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Account, LoginModalService, Principal } from '../shared';

import {HttpClient, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {map} from 'rxjs/operators';
import { ProductService, Product } from '../entities/product';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: [
        'home.scss'
    ]

})
export class HomeComponent implements OnInit, OnDestroy {
    account: Account;
    modalRef: NgbModalRef;

    products: Product[];
    images: Array<string>;

    constructor(
        private principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private _http: HttpClient,
        private productService: ProductService,
    ) {
    }

    ngOnInit() {
        this.productService.query({
            page: 0,
            size: 100,
            sort: this.sort()}).subscribe(
                (res: HttpResponse<Product[]>) => this.products = res.body,
                (res: HttpErrorResponse) => console.error(res.message)
        );
        this.registerAuthenticationSuccess();
    }

    sort() {
        const result = ['desc'];
        result.push('id');
        return result;
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

    ngOnDestroy() {
    }
}
