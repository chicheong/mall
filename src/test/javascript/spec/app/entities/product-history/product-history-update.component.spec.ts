import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { ProductHistoryUpdateComponent } from 'app/entities/product-history/product-history-update.component';
import { ProductHistoryService } from 'app/entities/product-history/product-history.service';
import { ProductHistory } from 'app/shared/model/product-history.model';

describe('Component Tests', () => {
  describe('ProductHistory Management Update Component', () => {
    let comp: ProductHistoryUpdateComponent;
    let fixture: ComponentFixture<ProductHistoryUpdateComponent>;
    let service: ProductHistoryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MallTestModule],
        declarations: [ProductHistoryUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(ProductHistoryUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProductHistoryUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ProductHistoryService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new ProductHistory(123);
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
        const entity = new ProductHistory();
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
