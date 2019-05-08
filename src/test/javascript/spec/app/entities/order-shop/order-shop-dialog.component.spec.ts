/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { MallTestModule } from '../../../test.module';
import { OrderShopDialogComponent } from '../../../../../../main/webapp/app/entities/order-shop/order-shop-dialog.component';
import { OrderShopService } from '../../../../../../main/webapp/app/entities/order-shop/order-shop.service';
import { OrderShop } from '../../../../../../main/webapp/app/entities/order-shop/order-shop.model';
import { ShopService } from '../../../../../../main/webapp/app/entities/shop';
import { MyOrderService } from '../../../../../../main/webapp/app/entities/my-order';

describe('Component Tests', () => {

    describe('OrderShop Management Dialog Component', () => {
        let comp: OrderShopDialogComponent;
        let fixture: ComponentFixture<OrderShopDialogComponent>;
        let service: OrderShopService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [OrderShopDialogComponent],
                providers: [
                    ShopService,
                    MyOrderService,
                    OrderShopService
                ]
            })
            .overrideTemplate(OrderShopDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(OrderShopDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OrderShopService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new OrderShop(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.orderShop = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'orderShopListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new OrderShop();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.orderShop = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'orderShopListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
