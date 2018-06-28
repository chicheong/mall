/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { MallTestModule } from '../../../test.module';
import { PaymentStatusHistoryDetailComponent } from '../../../../../../main/webapp/app/entities/payment-status-history/payment-status-history-detail.component';
import { PaymentStatusHistoryService } from '../../../../../../main/webapp/app/entities/payment-status-history/payment-status-history.service';
import { PaymentStatusHistory } from '../../../../../../main/webapp/app/entities/payment-status-history/payment-status-history.model';

describe('Component Tests', () => {

    describe('PaymentStatusHistory Management Detail Component', () => {
        let comp: PaymentStatusHistoryDetailComponent;
        let fixture: ComponentFixture<PaymentStatusHistoryDetailComponent>;
        let service: PaymentStatusHistoryService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [PaymentStatusHistoryDetailComponent],
                providers: [
                    PaymentStatusHistoryService
                ]
            })
            .overrideTemplate(PaymentStatusHistoryDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PaymentStatusHistoryDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PaymentStatusHistoryService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new PaymentStatusHistory(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.paymentStatusHistory).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
