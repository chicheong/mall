/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { MallTestModule } from '../../../test.module';
import { OrderStatusHistoryDeleteDialogComponent } from 'app/entities/order-status-history/order-status-history-delete-dialog.component';
import { OrderStatusHistoryService } from 'app/entities/order-status-history/order-status-history.service';

describe('Component Tests', () => {
    describe('OrderStatusHistory Management Delete Component', () => {
        let comp: OrderStatusHistoryDeleteDialogComponent;
        let fixture: ComponentFixture<OrderStatusHistoryDeleteDialogComponent>;
        let service: OrderStatusHistoryService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [OrderStatusHistoryDeleteDialogComponent]
            })
                .overrideTemplate(OrderStatusHistoryDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(OrderStatusHistoryDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OrderStatusHistoryService);
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
