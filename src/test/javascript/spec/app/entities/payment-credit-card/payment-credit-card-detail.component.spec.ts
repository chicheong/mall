/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { MallTestModule } from '../../../test.module';
import { PaymentCreditCardDetailComponent } from '../../../../../../main/webapp/app/entities/payment-credit-card/payment-credit-card-detail.component';
import { PaymentCreditCardService } from '../../../../../../main/webapp/app/entities/payment-credit-card/payment-credit-card.service';
import { PaymentCreditCard } from '../../../../../../main/webapp/app/entities/payment-credit-card/payment-credit-card.model';

describe('Component Tests', () => {

    describe('PaymentCreditCard Management Detail Component', () => {
        let comp: PaymentCreditCardDetailComponent;
        let fixture: ComponentFixture<PaymentCreditCardDetailComponent>;
        let service: PaymentCreditCardService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [PaymentCreditCardDetailComponent],
                providers: [
                    PaymentCreditCardService
                ]
            })
            .overrideTemplate(PaymentCreditCardDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PaymentCreditCardDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PaymentCreditCardService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new PaymentCreditCard(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.paymentCreditCard).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
