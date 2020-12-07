import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IShippingStatusHistory } from 'app/shared/model/shipping-status-history.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { ShippingStatusHistoryService } from './shipping-status-history.service';
import { ShippingStatusHistoryDeleteDialogComponent } from './shipping-status-history-delete-dialog.component';

@Component({
  selector: 'jhi-shipping-status-history',
  templateUrl: './shipping-status-history.component.html'
})
export class ShippingStatusHistoryComponent implements OnInit, OnDestroy {
  shippingStatusHistories: IShippingStatusHistory[];
  eventSubscriber?: Subscription;
  itemsPerPage: number;
  links: any;
  page: number;
  predicate: string;
  ascending: boolean;
  currentSearch: string;

  constructor(
    protected shippingStatusHistoryService: ShippingStatusHistoryService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected parseLinks: JhiParseLinks,
    protected activatedRoute: ActivatedRoute
  ) {
    this.shippingStatusHistories = [];
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
      this.shippingStatusHistoryService
        .search({
          query: this.currentSearch,
          page: this.page,
          size: this.itemsPerPage,
          sort: this.sort()
        })
        .subscribe((res: HttpResponse<IShippingStatusHistory[]>) => this.paginateShippingStatusHistories(res.body, res.headers));
      return;
    }

    this.shippingStatusHistoryService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort()
      })
      .subscribe((res: HttpResponse<IShippingStatusHistory[]>) => this.paginateShippingStatusHistories(res.body, res.headers));
  }

  reset(): void {
    this.page = 0;
    this.shippingStatusHistories = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  search(query: string): void {
    this.shippingStatusHistories = [];
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
    this.registerChangeInShippingStatusHistories();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IShippingStatusHistory): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInShippingStatusHistories(): void {
    this.eventSubscriber = this.eventManager.subscribe('shippingStatusHistoryListModification', () => this.reset());
  }

  delete(shippingStatusHistory: IShippingStatusHistory): void {
    const modalRef = this.modalService.open(ShippingStatusHistoryDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.shippingStatusHistory = shippingStatusHistory;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateShippingStatusHistories(data: IShippingStatusHistory[] | null, headers: HttpHeaders): void {
    const headersLink = headers.get('link');
    this.links = this.parseLinks.parse(headersLink ? headersLink : '');
    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.shippingStatusHistories.push(data[i]);
      }
    }
  }
}
