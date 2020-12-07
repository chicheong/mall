import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { ShippingDetailComponent } from 'app/entities/shipping/shipping-detail.component';
import { Shipping } from 'app/shared/model/shipping.model';

describe('Component Tests', () => {
  describe('Shipping Management Detail Component', () => {
    let comp: ShippingDetailComponent;
    let fixture: ComponentFixture<ShippingDetailComponent>;
    const route = ({ data: of({ shipping: new Shipping(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MallTestModule],
        declarations: [ShippingDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(ShippingDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ShippingDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load shipping on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.shipping).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
