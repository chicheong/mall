import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { DelegationUpdateComponent } from 'app/entities/delegation/delegation-update.component';
import { DelegationService } from 'app/entities/delegation/delegation.service';
import { Delegation } from 'app/shared/model/delegation.model';

describe('Component Tests', () => {
  describe('Delegation Management Update Component', () => {
    let comp: DelegationUpdateComponent;
    let fixture: ComponentFixture<DelegationUpdateComponent>;
    let service: DelegationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MallTestModule],
        declarations: [DelegationUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(DelegationUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DelegationUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DelegationService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Delegation(123);
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
        const entity = new Delegation();
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
