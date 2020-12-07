import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { MyStateDetailComponent } from 'app/entities/my-state/my-state-detail.component';
import { MyState } from 'app/shared/model/my-state.model';

describe('Component Tests', () => {
  describe('MyState Management Detail Component', () => {
    let comp: MyStateDetailComponent;
    let fixture: ComponentFixture<MyStateDetailComponent>;
    const route = ({ data: of({ myState: new MyState(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MallTestModule],
        declarations: [MyStateDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(MyStateDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(MyStateDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load myState on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.myState).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
