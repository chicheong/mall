import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrderStatusHistory } from 'app/shared/model/order-status-history.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { OrderStatusHistoryService } from './order-status-history.service';
import { OrderStatusHistoryDeleteDialogComponent } from './order-status-history-delete-dialog.component';

@Component({
  selector: 'jhi-order-status-history',
  templateUrl: './order-status-history.component.html'
})
export class OrderStatusHistoryComponent implements OnInit, OnDestroy {
  orderStatusHistories: IOrderStatusHistory[];
  eventSubscriber?: Subscription;
  itemsPerPage: number;
  links: any;
  page: number;
  predicate: string;
  ascending: boolean;
  currentSearch: string;

  constructor(
    protected orderStatusHistoryService: OrderStatusHistoryService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected parseLinks: JhiParseLinks,
    protected activatedRoute: ActivatedRoute
  ) {
    this.orderStatusHistories = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0
    };
    this.predicate = 'id';
    this.ascending = true;
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.queryParams['search']
        ? this.activatedRoute.snapshot.queryParams['search']
        : '';
  }

  loadAll(): void {
    if (this.currentSearch) {
      this.orderStatusHistoryService
        .search({
          query: this.currentSearch,
          page: this.page,
          size: this.itemsPerPage,
          sort: this.sort()
        })
        .subscribe((res: HttpResponse<IOrderStatusHistory[]>) => this.paginateOrderStatusHistories(res.body, res.headers));
      return;
    }

    this.orderStatusHistoryService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort()
      })
      .subscribe((res: HttpResponse<IOrderStatusHistory[]>) => this.paginateOrderStatusHistories(res.body, res.headers));
  }

  reset(): void {
    this.page = 0;
    this.orderStatusHistories = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  search(query: string): void {
    this.orderStatusHistories = [];
    this.links = {
      last: 0
    };
    this.page = 0;
    if (query) {
      this.predicate = '_score';
      this.ascending = false;
    } else {
      this.predicate = 'id';
      this.ascending = true;
    }
    this.currentSearch = query;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInOrderStatusHistories();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IOrderStatusHistory): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInOrderStatusHistories(): void {
    this.eventSubscriber = this.eventManager.subscribe('orderStatusHistoryListModification', () => this.reset());
  }

  delete(orderStatusHistory: IOrderStatusHistory): void {
    const modalRef = this.modalService.open(OrderStatusHistoryDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.orderStatusHistory = orderStatusHistory;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateOrderStatusHistories(data: IOrderStatusHistory[] | null, headers: HttpHeaders): void {
    const headersLink = headers.get('link');
    this.links = this.parseLinks.parse(headersLink ? headersLink : '');
    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.orderStatusHistories.push(data[i]);
      }
    }
  }
}
