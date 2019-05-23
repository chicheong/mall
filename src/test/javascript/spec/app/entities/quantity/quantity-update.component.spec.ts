/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { QuantityUpdateComponent } from 'app/entities/quantity/quantity-update.component';
import { QuantityService } from 'app/entities/quantity/quantity.service';
import { Quantity } from 'app/shared/model/quantity.model';

describe('Component Tests', () => {
    describe('Quantity Management Update Component', () => {
        let comp: QuantityUpdateComponent;
        let fixture: ComponentFixture<QuantityUpdateComponent>;
        let service: QuantityService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [QuantityUpdateComponent]
            })
                .overrideTemplate(QuantityUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(QuantityUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QuantityService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Quantity(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.quantity = entity;
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
                    const entity = new Quantity();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.quantity = entity;
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
