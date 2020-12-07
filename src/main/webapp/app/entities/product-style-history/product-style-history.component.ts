import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProductStyleHistory } from 'app/shared/model/product-style-history.model';
import { ProductStyleHistoryService } from './product-style-history.service';
import { ProductStyleHistoryDeleteDialogComponent } from './product-style-history-delete-dialog.component';

@Component({
  selector: 'jhi-product-style-history',
  templateUrl: './product-style-history.component.html'
})
export class ProductStyleHistoryComponent implements OnInit, OnDestroy {
  productStyleHistories?: IProductStyleHistory[];
  eventSubscriber?: Subscription;
  currentSearch: string;

  constructor(
    protected productStyleHistoryService: ProductStyleHistoryService,
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
      this.productStyleHistoryService
        .search({
          query: this.currentSearch
        })
        .subscribe((res: HttpResponse<IProductStyleHistory[]>) => (this.productStyleHistories = res.body || []));
      return;
    }

    this.productStyleHistoryService
      .query()
      .subscribe((res: HttpResponse<IProductStyleHistory[]>) => (this.productStyleHistories = res.body || []));
  }

  search(query: string): void {
    this.currentSearch = query;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInProductStyleHistories();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IProductStyleHistory): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInProductStyleHistories(): void {
    this.eventSubscriber = this.eventManager.subscribe('productStyleHistoryListModification', () => this.loadAll());
  }

  delete(productStyleHistory: IProductStyleHistory): void {
    const modalRef = this.modalService.open(ProductStyleHistoryDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.productStyleHistory = productStyleHistory;
  }
}
