import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { ProductStyleUpdateComponent } from 'app/entities/product-style/product-style-update.component';
import { ProductStyleService } from 'app/entities/product-style/product-style.service';
import { ProductStyle } from 'app/shared/model/product-style.model';

describe('Component Tests', () => {
  describe('ProductStyle Management Update Component', () => {
    let comp: ProductStyleUpdateComponent;
    let fixture: ComponentFixture<ProductStyleUpdateComponent>;
    let service: ProductStyleService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MallTestModule],
        declarations: [ProductStyleUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(ProductStyleUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProductStyleUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ProductStyleService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new ProductStyle(123);
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
        const entity = new ProductStyle();
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
