/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MallTestModule } from '../../../test.module';
import { PaymentCardComponent } from '../../../../../../main/webapp/app/entities/payment-card/payment-card.component';
import { PaymentCardService } from '../../../../../../main/webapp/app/entities/payment-card/payment-card.service';
import { PaymentCard } from '../../../../../../main/webapp/app/entities/payment-card/payment-card.model';

describe('Component Tests', () => {

    describe('PaymentCard Management Component', () => {
        let comp: PaymentCardComponent;
        let fixture: ComponentFixture<PaymentCardComponent>;
        let service: PaymentCardService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [PaymentCardComponent],
                providers: [
                    PaymentCardService
                ]
            })
            .overrideTemplate(PaymentCardComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PaymentCardComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PaymentCardService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new PaymentCard(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.paymentCards[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
