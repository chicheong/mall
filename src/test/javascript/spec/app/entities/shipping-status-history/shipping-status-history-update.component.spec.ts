import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { ShippingStatusHistoryUpdateComponent } from 'app/entities/shipping-status-history/shipping-status-history-update.component';
import { ShippingStatusHistoryService } from 'app/entities/shipping-status-history/shipping-status-history.service';
import { ShippingStatusHistory } from 'app/shared/model/shipping-status-history.model';

describe('Component Tests', () => {
  describe('ShippingStatusHistory Management Update Component', () => {
    let comp: ShippingStatusHistoryUpdateComponent;
    let fixture: ComponentFixture<ShippingStatusHistoryUpdateComponent>;
    let service: ShippingStatusHistoryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MallTestModule],
        declarations: [ShippingStatusHistoryUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(ShippingStatusHistoryUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ShippingStatusHistoryUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ShippingStatusHistoryService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new ShippingStatusHistory(123);
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
        const entity = new ShippingStatusHistory();
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
