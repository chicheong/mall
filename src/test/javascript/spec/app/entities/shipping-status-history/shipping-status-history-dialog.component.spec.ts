/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { MallTestModule } from '../../../test.module';
import { ShippingStatusHistoryDialogComponent } from '../../../../../../main/webapp/app/entities/shipping-status-history/shipping-status-history-dialog.component';
import { ShippingStatusHistoryService } from '../../../../../../main/webapp/app/entities/shipping-status-history/shipping-status-history.service';
import { ShippingStatusHistory } from '../../../../../../main/webapp/app/entities/shipping-status-history/shipping-status-history.model';
import { ShippingService } from '../../../../../../main/webapp/app/entities/shipping';

describe('Component Tests', () => {

    describe('ShippingStatusHistory Management Dialog Component', () => {
        let comp: ShippingStatusHistoryDialogComponent;
        let fixture: ComponentFixture<ShippingStatusHistoryDialogComponent>;
        let service: ShippingStatusHistoryService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [ShippingStatusHistoryDialogComponent],
                providers: [
                    ShippingService,
                    ShippingStatusHistoryService
                ]
            })
            .overrideTemplate(ShippingStatusHistoryDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ShippingStatusHistoryDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ShippingStatusHistoryService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new ShippingStatusHistory(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.shippingStatusHistory = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'shippingStatusHistoryListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new ShippingStatusHistory();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.shippingStatusHistory = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'shippingStatusHistoryListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
