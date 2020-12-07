import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { ProductItemUpdateComponent } from 'app/entities/product-item/product-item-update.component';
import { ProductItemService } from 'app/entities/product-item/product-item.service';
import { ProductItem } from 'app/shared/model/product-item.model';

describe('Component Tests', () => {
  describe('ProductItem Management Update Component', () => {
    let comp: ProductItemUpdateComponent;
    let fixture: ComponentFixture<ProductItemUpdateComponent>;
    let service: ProductItemService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MallTestModule],
        declarations: [ProductItemUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(ProductItemUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProductItemUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ProductItemService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new ProductItem(123);
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
        const entity = new ProductItem();
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
