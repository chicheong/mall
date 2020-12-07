import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { OrderStatusHistoryUpdateComponent } from 'app/entities/order-status-history/order-status-history-update.component';
import { OrderStatusHistoryService } from 'app/entities/order-status-history/order-status-history.service';
import { OrderStatusHistory } from 'app/shared/model/order-status-history.model';

describe('Component Tests', () => {
  describe('OrderStatusHistory Management Update Component', () => {
    let comp: OrderStatusHistoryUpdateComponent;
    let fixture: ComponentFixture<OrderStatusHistoryUpdateComponent>;
    let service: OrderStatusHistoryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MallTestModule],
        declarations: [OrderStatusHistoryUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(OrderStatusHistoryUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OrderStatusHistoryUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(OrderStatusHistoryService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new OrderStatusHistory(123);
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
        const entity = new OrderStatusHistory();
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
