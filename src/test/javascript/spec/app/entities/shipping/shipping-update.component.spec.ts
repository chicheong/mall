import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { ShippingUpdateComponent } from 'app/entities/shipping/shipping-update.component';
import { ShippingService } from 'app/entities/shipping/shipping.service';
import { Shipping } from 'app/shared/model/shipping.model';

describe('Component Tests', () => {
  describe('Shipping Management Update Component', () => {
    let comp: ShippingUpdateComponent;
    let fixture: ComponentFixture<ShippingUpdateComponent>;
    let service: ShippingService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MallTestModule],
        declarations: [ShippingUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(ShippingUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ShippingUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ShippingService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Shipping(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new Shipping();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
