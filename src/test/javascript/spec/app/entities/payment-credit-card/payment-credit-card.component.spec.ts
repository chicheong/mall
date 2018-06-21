/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MallTestModule } from '../../../test.module';
import { PaymentCreditCardComponent } from '../../../../../../main/webapp/app/entities/payment-credit-card/payment-credit-card.component';
import { PaymentCreditCardService } from '../../../../../../main/webapp/app/entities/payment-credit-card/payment-credit-card.service';
import { PaymentCreditCard } from '../../../../../../main/webapp/app/entities/payment-credit-card/payment-credit-card.model';

describe('Component Tests', () => {

    describe('PaymentCreditCard Management Component', () => {
        let comp: PaymentCreditCardComponent;
        let fixture: ComponentFixture<PaymentCreditCardComponent>;
        let service: PaymentCreditCardService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [PaymentCreditCardComponent],
                providers: [
                    PaymentCreditCardService
                ]
            })
            .overrideTemplate(PaymentCreditCardComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PaymentCreditCardComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PaymentCreditCardService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new PaymentCreditCard(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.paymentCreditCards[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
