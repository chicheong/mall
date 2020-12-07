import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { LoginModalService } from 'app/core/login/login-modal.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { ProductService } from 'app/entities/product/product.service';
import { IProduct } from 'app/shared/model/product.model';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  authSubscription?: Subscription;
  products: IProduct[] | null = null;

  constructor(private accountService: AccountService, private loginModalService: LoginModalService, private productService: ProductService) {}

  ngOnInit(): void {
    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => (this.account = account));
    this.productService.query({
        page: 0,
        size: 100,
        sort: this.sort()}).subscribe(
            (res: HttpResponse<IProduct[]>) => this.products = res.body,
            (res: HttpErrorResponse) => console.error(res.message)
    );
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  login(): void {
    this.loginModalService.open();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  sort(): string[] {
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
}
