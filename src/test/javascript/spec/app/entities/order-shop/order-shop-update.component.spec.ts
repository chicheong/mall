/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { OrderShopUpdateComponent } from 'app/entities/order-shop/order-shop-update.component';
import { OrderShopService } from 'app/entities/order-shop/order-shop.service';
import { OrderShop } from 'app/shared/model/order-shop.model';

describe('Component Tests', () => {
    describe('OrderShop Management Update Component', () => {
        let comp: OrderShopUpdateComponent;
        let fixture: ComponentFixture<OrderShopUpdateComponent>;
        let service: OrderShopService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [OrderShopUpdateComponent]
            })
                .overrideTemplate(OrderShopUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(OrderShopUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OrderShopService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new OrderShop(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.orderShop = entity;
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
                    const entity = new OrderShop();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.orderShop = entity;
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
