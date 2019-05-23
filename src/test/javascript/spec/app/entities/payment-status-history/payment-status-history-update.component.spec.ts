/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { PaymentStatusHistoryUpdateComponent } from 'app/entities/payment-status-history/payment-status-history-update.component';
import { PaymentStatusHistoryService } from 'app/entities/payment-status-history/payment-status-history.service';
import { PaymentStatusHistory } from 'app/shared/model/payment-status-history.model';

describe('Component Tests', () => {
    describe('PaymentStatusHistory Management Update Component', () => {
        let comp: PaymentStatusHistoryUpdateComponent;
        let fixture: ComponentFixture<PaymentStatusHistoryUpdateComponent>;
        let service: PaymentStatusHistoryService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [PaymentStatusHistoryUpdateComponent]
            })
                .overrideTemplate(PaymentStatusHistoryUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PaymentStatusHistoryUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PaymentStatusHistoryService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new PaymentStatusHistory(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.paymentStatusHistory = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new PaymentStatusHistory();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.paymentStatusHistory = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});
