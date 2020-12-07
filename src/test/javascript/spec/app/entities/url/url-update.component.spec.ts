import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { UrlUpdateComponent } from 'app/entities/url/url-update.component';
import { UrlService } from 'app/entities/url/url.service';
import { Url } from 'app/shared/model/url.model';

describe('Component Tests', () => {
  describe('Url Management Update Component', () => {
    let comp: UrlUpdateComponent;
    let fixture: ComponentFixture<UrlUpdateComponent>;
    let service: UrlService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MallTestModule],
        declarations: [UrlUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(UrlUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(UrlUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(UrlService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Url(123);
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
        const entity = new Url();
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
