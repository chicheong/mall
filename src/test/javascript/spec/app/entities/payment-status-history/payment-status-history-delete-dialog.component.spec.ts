/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { MallTestModule } from '../../../test.module';
import { PaymentStatusHistoryDeleteDialogComponent } from 'app/entities/payment-status-history/payment-status-history-delete-dialog.component';
import { PaymentStatusHistoryService } from 'app/entities/payment-status-history/payment-status-history.service';

describe('Component Tests', () => {
    describe('PaymentStatusHistory Management Delete Component', () => {
        let comp: PaymentStatusHistoryDeleteDialogComponent;
        let fixture: ComponentFixture<PaymentStatusHistoryDeleteDialogComponent>;
        let service: PaymentStatusHistoryService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [PaymentStatusHistoryDeleteDialogComponent]
            })
                .overrideTemplate(PaymentStatusHistoryDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(PaymentStatusHistoryDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PaymentStatusHistoryService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
