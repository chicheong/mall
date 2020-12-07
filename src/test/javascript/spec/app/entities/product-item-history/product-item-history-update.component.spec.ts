import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { ProductItemHistoryUpdateComponent } from 'app/entities/product-item-history/product-item-history-update.component';
import { ProductItemHistoryService } from 'app/entities/product-item-history/product-item-history.service';
import { ProductItemHistory } from 'app/shared/model/product-item-history.model';

describe('Component Tests', () => {
  describe('ProductItemHistory Management Update Component', () => {
    let comp: ProductItemHistoryUpdateComponent;
    let fixture: ComponentFixture<ProductItemHistoryUpdateComponent>;
    let service: ProductItemHistoryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MallTestModule],
        declarations: [ProductItemHistoryUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(ProductItemHistoryUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProductItemHistoryUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ProductItemHistoryService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new ProductItemHistory(123);
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
        const entity = new ProductItemHistory();
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
