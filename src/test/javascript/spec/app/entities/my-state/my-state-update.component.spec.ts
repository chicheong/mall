import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { MyStateUpdateComponent } from 'app/entities/my-state/my-state-update.component';
import { MyStateService } from 'app/entities/my-state/my-state.service';
import { MyState } from 'app/shared/model/my-state.model';

describe('Component Tests', () => {
  describe('MyState Management Update Component', () => {
    let comp: MyStateUpdateComponent;
    let fixture: ComponentFixture<MyStateUpdateComponent>;
    let service: MyStateService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MallTestModule],
        declarations: [MyStateUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(MyStateUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MyStateUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(MyStateService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new MyState(123);
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
        const entity = new MyState();
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
