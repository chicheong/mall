import {HttpClient, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { LoginModalService, AccountService, Account } from 'app/core';

import { ProductService } from 'app/entities/product/product.service';
import { IProduct } from 'app/shared/model/product.model';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: ['home.scss']
})
export class HomeComponent implements OnInit {
    account: Account;
    modalRef: NgbModalRef;

    products: IProduct[];
    images: Array<string>;

    constructor(
        private accountService: AccountService,
        private loginModalService: LoginModalService,
        private productService: ProductService,
        private eventManager: JhiEventManager
    ) {}

    ngOnInit() {
        this.productService.query({
            page: 0,
            size: 100,
            sort: this.sort()}).subscribe(
                (res: HttpResponse<IProduct[]>) => this.products = res.body,
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
        this.eventManager.subscribe('authenticationSuccess', message => {
            // console.error('home subscribe authenticationSuccess');
            this.accountService.identity().then(account => {
                // console.error('home this.principal.identity().then');
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.accountService.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }
}
