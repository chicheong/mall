import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { MyAccountUpdateComponent } from 'app/entities/my-account/my-account-update.component';
import { MyAccountService } from 'app/entities/my-account/my-account.service';
import { MyAccount } from 'app/shared/model/my-account.model';

describe('Component Tests', () => {
  describe('MyAccount Management Update Component', () => {
    let comp: MyAccountUpdateComponent;
    let fixture: ComponentFixture<MyAccountUpdateComponent>;
    let service: MyAccountService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MallTestModule],
        declarations: [MyAccountUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(MyAccountUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MyAccountUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(MyAccountService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new MyAccount(123);
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
        const entity = new MyAccount();
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
