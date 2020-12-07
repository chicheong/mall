import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { OrderStatusHistoryDetailComponent } from 'app/entities/order-status-history/order-status-history-detail.component';
import { OrderStatusHistory } from 'app/shared/model/order-status-history.model';

describe('Component Tests', () => {
  describe('OrderStatusHistory Management Detail Component', () => {
    let comp: OrderStatusHistoryDetailComponent;
    let fixture: ComponentFixture<OrderStatusHistoryDetailComponent>;
    const route = ({ data: of({ orderStatusHistory: new OrderStatusHistory(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MallTestModule],
        declarations: [OrderStatusHistoryDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(OrderStatusHistoryDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(OrderStatusHistoryDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load orderStatusHistory on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.orderStatusHistory).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
