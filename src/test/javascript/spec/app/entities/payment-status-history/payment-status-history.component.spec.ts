/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MallTestModule } from '../../../test.module';
import { PaymentStatusHistoryComponent } from '../../../../../../main/webapp/app/entities/payment-status-history/payment-status-history.component';
import { PaymentStatusHistoryService } from '../../../../../../main/webapp/app/entities/payment-status-history/payment-status-history.service';
import { PaymentStatusHistory } from '../../../../../../main/webapp/app/entities/payment-status-history/payment-status-history.model';

describe('Component Tests', () => {

    describe('PaymentStatusHistory Management Component', () => {
        let comp: PaymentStatusHistoryComponent;
        let fixture: ComponentFixture<PaymentStatusHistoryComponent>;
        let service: PaymentStatusHistoryService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [PaymentStatusHistoryComponent],
                providers: [
                    PaymentStatusHistoryService
                ]
            })
            .overrideTemplate(PaymentStatusHistoryComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PaymentStatusHistoryComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PaymentStatusHistoryService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new PaymentStatusHistory(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.paymentStatusHistories[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
