import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiLanguageService, JhiEventManager } from 'ng-jhipster';
import { SessionStorageService } from 'ngx-webstorage';

import { VERSION } from 'app/app.constants';
import { JhiLanguageHelper, AccountService, LoginModalService, LoginService } from 'app/core';
import { ProfileService } from 'app/layouts/profiles/profile.service';

import { Subscription } from 'rxjs';

import { IMyAccount } from 'app/shared/model/my-account.model';
import { MyAccountService } from 'app/entities/my-account';
import { IShop } from 'app/shared/model/shop.model';
import { IMyOrder } from 'app/shared/model/my-order.model';
import { MyOrderService } from 'app/entities/my-order';

@Component({
    selector: 'jhi-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['navbar.scss']
})
export class NavbarComponent implements OnInit {
    inProduction: boolean;
    isNavbarCollapsed: boolean;
    languages: any[];
    swaggerEnabled: boolean;
    modalRef: NgbModalRef;
    version: string;
    eventSubscriber: Subscription;
    myAccount: IMyAccount;
    noOfItems = 0;

    constructor(
        private loginService: LoginService,
        private languageService: JhiLanguageService,
        private languageHelper: JhiLanguageHelper,
        private sessionStorage: SessionStorageService,
        private accountService: AccountService,
        private loginModalService: LoginModalService,
        private profileService: ProfileService,
        private router: Router,
        private eventManager: JhiEventManager,
        private myAccountService: MyAccountService,
        private myOrderService: MyOrderService
    ) {
        this.version = VERSION ? 'v' + VERSION : '';
        this.isNavbarCollapsed = true;
    }

    ngOnInit() {
        this.languageHelper.getAll().then(languages => {
            this.languages = languages;
        });

        this.profileService.getProfileInfo().then(profileInfo => {
            this.inProduction = profileInfo.inProduction;
            this.swaggerEnabled = profileInfo.swaggerEnabled;
        });

        this.registerMyOrderUpdated();
        this.registerAuthenticationSuccess();
        // this.registerChangeInAccount();
        // console.error('check navbar Authenticated?');
        this.accountService.identity().then(account => {
            if (account) {
                this.eventManager.broadcast({
                    name: 'authenticationSuccess',
                    content: 'Sending Already Authenticated'
                });
            }
        });
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', message => {
            // console.error('navbar registerAuthenticationSuccess');
            this.accountService.identity().then(account => {
                // console.error('navbar this.principal.identity().then');
                if (account) {
                    if (account.myAccount) {
                        this.myAccount = account.myAccount;
                        this.calculateMyOrderTotalItems();
                    } else {
                        this.myAccount = undefined;
                    }
                }
                /**
                if (account && account.myAccount) {
                    this.myAccountService.find(account.myAccount.id).subscribe((myAccountResponse: HttpResponse<MyAccount>) => {
                        this.myAccount = myAccountResponse.body;
                    });
                } else {
                    this.myAccount = undefined;
                }
                */
            });
        });
    }

    registerMyOrderUpdated() {
        this.eventSubscriber = this.eventManager.subscribe(
            'myOrderModification',
            response => {
                this.updateMyOrder(response.obj);
                this.calculateMyOrderTotalItems();
            }
        );
    }

    updateMyOrder(myOrder: IMyOrder) {
        this.myAccount.myOrder = myOrder;
    }

    calculateMyOrderTotalItems() {
        console.error('calculateMyOrderTotalItems()');
        if (this.myAccount.myOrder && this.myAccount.myOrder.shops) {
            this.noOfItems = this.myOrderService.calculateTotalQuantity(this.myAccount.myOrder);
            console.error('this.noOfItems: ' + this.noOfItems);
        } else {
            this.noOfItems = 0;
        }
    }

    onDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInAccount() {
        this.eventSubscriber = this.eventManager.subscribe('accountModification', response => this.updateAfterAccountChanged());
    }

    updateAfterAccountChanged() {
        console.error('Account updated!!');
        this.accountService.identity().then(account => {
            console.error('Account.id: ' + account.id);
            console.error('Account.login: ' + account.login);
            console.error('Account.firstName: ' + account.firstName);
            console.error('Account.activated: ' + account.activated);
            console.error('Account.langKey: ' + account.langKey);
            console.error('Account.authorities: ' + account.authorities);
            console.error('Account.createdDate: ' + account.createdDate);
            console.error('Account.password: ' + account.password);
            console.error('Account.email: ' + account.email);
            console.error('Account.userInfo: ' + account.userInfo);
            console.error('Account.shops: ' + account.shops);
        });
    }

    changeLanguage(languageKey: string) {
        this.sessionStorage.store('locale', languageKey);
        this.languageService.changeLanguage(languageKey);
    }

    collapseNavbar() {
        this.isNavbarCollapsed = true;
    }

    isAuthenticated() {
        return this.accountService.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    logout() {
        this.collapseNavbar();
        this.loginService.logout();
        this.router.navigate(['']);
    }

    toggleNavbar() {
        this.isNavbarCollapsed = !this.isNavbarCollapsed;
    }

    getImageUrl() {
        return this.isAuthenticated() ? this.accountService.getImageUrl() : null;
    }
}
