import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { ShippingTypeDetailComponent } from 'app/entities/shipping-type/shipping-type-detail.component';
import { ShippingType } from 'app/shared/model/shipping-type.model';

describe('Component Tests', () => {
  describe('ShippingType Management Detail Component', () => {
    let comp: ShippingTypeDetailComponent;
    let fixture: ComponentFixture<ShippingTypeDetailComponent>;
    const route = ({ data: of({ shippingType: new ShippingType(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MallTestModule],
        declarations: [ShippingTypeDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(ShippingTypeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ShippingTypeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load shippingType on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.shippingType).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
