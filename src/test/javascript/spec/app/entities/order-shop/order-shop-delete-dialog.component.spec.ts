/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { MallTestModule } from '../../../test.module';
import { OrderShopDeleteDialogComponent } from 'app/entities/order-shop/order-shop-delete-dialog.component';
import { OrderShopService } from 'app/entities/order-shop/order-shop.service';

describe('Component Tests', () => {
    describe('OrderShop Management Delete Component', () => {
        let comp: OrderShopDeleteDialogComponent;
        let fixture: ComponentFixture<OrderShopDeleteDialogComponent>;
        let service: OrderShopService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [OrderShopDeleteDialogComponent]
            })
                .overrideTemplate(OrderShopDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(OrderShopDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OrderShopService);
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
