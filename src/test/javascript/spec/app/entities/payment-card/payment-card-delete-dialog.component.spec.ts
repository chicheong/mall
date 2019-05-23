/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { MallTestModule } from '../../../test.module';
import { PaymentCardDeleteDialogComponent } from 'app/entities/payment-card/payment-card-delete-dialog.component';
import { PaymentCardService } from 'app/entities/payment-card/payment-card.service';

describe('Component Tests', () => {
    describe('PaymentCard Management Delete Component', () => {
        let comp: PaymentCardDeleteDialogComponent;
        let fixture: ComponentFixture<PaymentCardDeleteDialogComponent>;
        let service: PaymentCardService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [PaymentCardDeleteDialogComponent]
            })
                .overrideTemplate(PaymentCardDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(PaymentCardDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PaymentCardService);
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
