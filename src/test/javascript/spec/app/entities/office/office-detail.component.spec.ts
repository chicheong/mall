import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { OfficeDetailComponent } from 'app/entities/office/office-detail.component';
import { Office } from 'app/shared/model/office.model';

describe('Component Tests', () => {
  describe('Office Management Detail Component', () => {
    let comp: OfficeDetailComponent;
    let fixture: ComponentFixture<OfficeDetailComponent>;
    const route = ({ data: of({ office: new Office(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MallTestModule],
        declarations: [OfficeDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(OfficeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(OfficeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load office on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.office).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
