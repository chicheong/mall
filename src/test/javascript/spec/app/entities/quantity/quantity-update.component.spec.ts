import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

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
        declarations: [QuantityUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(QuantityUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(QuantityUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(QuantityService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Quantity(123);
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
        const entity = new Quantity();
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
