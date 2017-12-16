/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { MallTestModule } from '../../../test.module';
import { OrderStatusHistoryDialogComponent } from '../../../../../../main/webapp/app/entities/order-status-history/order-status-history-dialog.component';
import { OrderStatusHistoryService } from '../../../../../../main/webapp/app/entities/order-status-history/order-status-history.service';
import { OrderStatusHistory } from '../../../../../../main/webapp/app/entities/order-status-history/order-status-history.model';
import { MyOrderService } from '../../../../../../main/webapp/app/entities/my-order';

describe('Component Tests', () => {

    describe('OrderStatusHistory Management Dialog Component', () => {
        let comp: OrderStatusHistoryDialogComponent;
        let fixture: ComponentFixture<OrderStatusHistoryDialogComponent>;
        let service: OrderStatusHistoryService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [OrderStatusHistoryDialogComponent],
                providers: [
                    MyOrderService,
                    OrderStatusHistoryService
                ]
            })
            .overrideTemplate(OrderStatusHistoryDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(OrderStatusHistoryDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OrderStatusHistoryService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new OrderStatusHistory(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(entity));
                        comp.orderStatusHistory = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'orderStatusHistoryListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new OrderStatusHistory();
                        spyOn(service, 'create').and.returnValue(Observable.of(entity));
                        comp.orderStatusHistory = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'orderStatusHistoryListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
