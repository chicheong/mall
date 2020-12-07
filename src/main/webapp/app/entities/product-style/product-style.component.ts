import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProductStyle } from 'app/shared/model/product-style.model';
import { ProductStyleService } from './product-style.service';
import { ProductStyleDeleteDialogComponent } from './product-style-delete-dialog.component';

@Component({
  selector: 'jhi-product-style',
  templateUrl: './product-style.component.html'
})
export class ProductStyleComponent implements OnInit, OnDestroy {
  productStyles?: IProductStyle[];
  eventSubscriber?: Subscription;
  currentSearch: string;

  constructor(
    protected productStyleService: ProductStyleService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected activatedRoute: ActivatedRoute
  ) {
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.queryParams['search']
        ? this.activatedRoute.snapshot.queryParams['search']
        : '';
  }

  loadAll(): void {
    if (this.currentSearch) {
      this.productStyleService
        .search({
          query: this.currentSearch
        })
        .subscribe((res: HttpResponse<IProductStyle[]>) => (this.productStyles = res.body || []));
      return;
    }

    this.productStyleService.query().subscribe((res: HttpResponse<IProductStyle[]>) => (this.productStyles = res.body || []));
  }

  search(query: string): void {
    this.currentSearch = query;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInProductStyles();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IProductStyle): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInProductStyles(): void {
    this.eventSubscriber = this.eventManager.subscribe('productStyleListModification', () => this.loadAll());
  }

  delete(productStyle: IProductStyle): void {
    const modalRef = this.modalService.open(ProductStyleDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.productStyle = productStyle;
  }
}
