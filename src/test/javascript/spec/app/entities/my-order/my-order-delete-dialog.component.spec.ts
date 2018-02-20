/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { MallTestModule } from '../../../test.module';
import { MyOrderDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/my-order/my-order-delete-dialog.component';
import { MyOrderService } from '../../../../../../main/webapp/app/entities/my-order/my-order.service';

describe('Component Tests', () => {

    describe('MyOrder Management Delete Component', () => {
        let comp: MyOrderDeleteDialogComponent;
        let fixture: ComponentFixture<MyOrderDeleteDialogComponent>;
        let service: MyOrderService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [MyOrderDeleteDialogComponent],
                providers: [
                    MyOrderService
                ]
            })
            .overrideTemplate(MyOrderDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(MyOrderDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MyOrderService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        spyOn(service, 'delete').and.returnValue(Observable.of({}));

                        // WHEN
                        comp.confirmDelete(123);
                        tick();

                        // THEN
                        expect(service.delete).toHaveBeenCalledWith(123);
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
