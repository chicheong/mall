import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { PaymentCardDetailComponent } from 'app/entities/payment-card/payment-card-detail.component';
import { PaymentCard } from 'app/shared/model/payment-card.model';

describe('Component Tests', () => {
  describe('PaymentCard Management Detail Component', () => {
    let comp: PaymentCardDetailComponent;
    let fixture: ComponentFixture<PaymentCardDetailComponent>;
    const route = ({ data: of({ paymentCard: new PaymentCard(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MallTestModule],
        declarations: [PaymentCardDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(PaymentCardDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PaymentCardDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load paymentCard on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.paymentCard).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
