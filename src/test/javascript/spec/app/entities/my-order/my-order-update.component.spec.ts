/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { MyOrderUpdateComponent } from 'app/entities/my-order/my-order-update.component';
import { MyOrderService } from 'app/entities/my-order/my-order.service';
import { MyOrder } from 'app/shared/model/my-order.model';

describe('Component Tests', () => {
    describe('MyOrder Management Update Component', () => {
        let comp: MyOrderUpdateComponent;
        let fixture: ComponentFixture<MyOrderUpdateComponent>;
        let service: MyOrderService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [MyOrderUpdateComponent]
            })
                .overrideTemplate(MyOrderUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(MyOrderUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MyOrderService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new MyOrder(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.myOrder = entity;
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
                    const entity = new MyOrder();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.myOrder = entity;
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
