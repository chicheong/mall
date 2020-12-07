import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { ProductStyleHistoryUpdateComponent } from 'app/entities/product-style-history/product-style-history-update.component';
import { ProductStyleHistoryService } from 'app/entities/product-style-history/product-style-history.service';
import { ProductStyleHistory } from 'app/shared/model/product-style-history.model';

describe('Component Tests', () => {
  describe('ProductStyleHistory Management Update Component', () => {
    let comp: ProductStyleHistoryUpdateComponent;
    let fixture: ComponentFixture<ProductStyleHistoryUpdateComponent>;
    let service: ProductStyleHistoryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MallTestModule],
        declarations: [ProductStyleHistoryUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(ProductStyleHistoryUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProductStyleHistoryUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ProductStyleHistoryService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new ProductStyleHistory(123);
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
        const entity = new ProductStyleHistory();
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
