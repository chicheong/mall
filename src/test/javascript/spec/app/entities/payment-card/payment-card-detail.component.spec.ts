/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { MallTestModule } from '../../../test.module';
import { PaymentCardDetailComponent } from '../../../../../../main/webapp/app/entities/payment-card/payment-card-detail.component';
import { PaymentCardService } from '../../../../../../main/webapp/app/entities/payment-card/payment-card.service';
import { PaymentCard } from '../../../../../../main/webapp/app/entities/payment-card/payment-card.model';

describe('Component Tests', () => {

    describe('PaymentCard Management Detail Component', () => {
        let comp: PaymentCardDetailComponent;
        let fixture: ComponentFixture<PaymentCardDetailComponent>;
        let service: PaymentCardService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [PaymentCardDetailComponent],
                providers: [
                    PaymentCardService
                ]
            })
            .overrideTemplate(PaymentCardDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PaymentCardDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PaymentCardService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new PaymentCard(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.paymentCard).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
