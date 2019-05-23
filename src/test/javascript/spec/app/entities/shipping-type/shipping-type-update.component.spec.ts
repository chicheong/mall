/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { ShippingTypeUpdateComponent } from 'app/entities/shipping-type/shipping-type-update.component';
import { ShippingTypeService } from 'app/entities/shipping-type/shipping-type.service';
import { ShippingType } from 'app/shared/model/shipping-type.model';

describe('Component Tests', () => {
    describe('ShippingType Management Update Component', () => {
        let comp: ShippingTypeUpdateComponent;
        let fixture: ComponentFixture<ShippingTypeUpdateComponent>;
        let service: ShippingTypeService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [ShippingTypeUpdateComponent]
            })
                .overrideTemplate(ShippingTypeUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ShippingTypeUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ShippingTypeService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new ShippingType(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.shippingType = entity;
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
                    const entity = new ShippingType();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.shippingType = entity;
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
