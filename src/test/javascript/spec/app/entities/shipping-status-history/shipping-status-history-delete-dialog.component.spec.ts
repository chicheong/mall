/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { MallTestModule } from '../../../test.module';
import { ShippingStatusHistoryDeleteDialogComponent } from 'app/entities/shipping-status-history/shipping-status-history-delete-dialog.component';
import { ShippingStatusHistoryService } from 'app/entities/shipping-status-history/shipping-status-history.service';

describe('Component Tests', () => {
    describe('ShippingStatusHistory Management Delete Component', () => {
        let comp: ShippingStatusHistoryDeleteDialogComponent;
        let fixture: ComponentFixture<ShippingStatusHistoryDeleteDialogComponent>;
        let service: ShippingStatusHistoryService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [ShippingStatusHistoryDeleteDialogComponent]
            })
                .overrideTemplate(ShippingStatusHistoryDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ShippingStatusHistoryDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ShippingStatusHistoryService);
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
