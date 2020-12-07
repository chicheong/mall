import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { DelegationDetailComponent } from 'app/entities/delegation/delegation-detail.component';
import { Delegation } from 'app/shared/model/delegation.model';

describe('Component Tests', () => {
  describe('Delegation Management Detail Component', () => {
    let comp: DelegationDetailComponent;
    let fixture: ComponentFixture<DelegationDetailComponent>;
    const route = ({ data: of({ delegation: new Delegation(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MallTestModule],
        declarations: [DelegationDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(DelegationDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DelegationDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load delegation on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.delegation).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
