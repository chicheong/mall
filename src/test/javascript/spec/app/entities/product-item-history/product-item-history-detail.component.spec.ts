import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MallTestModule } from '../../../test.module';
import { ProductItemHistoryDetailComponent } from 'app/entities/product-item-history/product-item-history-detail.component';
import { ProductItemHistory } from 'app/shared/model/product-item-history.model';

describe('Component Tests', () => {
  describe('ProductItemHistory Management Detail Component', () => {
    let comp: ProductItemHistoryDetailComponent;
    let fixture: ComponentFixture<ProductItemHistoryDetailComponent>;
    const route = ({ data: of({ productItemHistory: new ProductItemHistory(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MallTestModule],
        declarations: [ProductItemHistoryDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(ProductItemHistoryDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ProductItemHistoryDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load productItemHistory on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.productItemHistory).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
