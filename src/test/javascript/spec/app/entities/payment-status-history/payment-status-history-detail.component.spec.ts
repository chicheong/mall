import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { PaymentStatusHistoryDetailComponent } from 'app/entities/payment-status-history/payment-status-history-detail.component';
import { PaymentStatusHistory } from 'app/shared/model/payment-status-history.model';

describe('Component Tests', () => {
  describe('PaymentStatusHistory Management Detail Component', () => {
    let comp: PaymentStatusHistoryDetailComponent;
    let fixture: ComponentFixture<PaymentStatusHistoryDetailComponent>;
    const route = ({ data: of({ paymentStatusHistory: new PaymentStatusHistory(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MallTestModule],
        declarations: [PaymentStatusHistoryDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(PaymentStatusHistoryDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PaymentStatusHistoryDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load paymentStatusHistory on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.paymentStatusHistory).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
