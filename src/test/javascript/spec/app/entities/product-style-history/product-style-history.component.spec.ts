import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MallTestModule } from '../../../test.module';
import { ProductStyleHistoryComponent } from 'app/entities/product-style-history/product-style-history.component';
import { ProductStyleHistoryService } from 'app/entities/product-style-history/product-style-history.service';
import { ProductStyleHistory } from 'app/shared/model/product-style-history.model';

describe('Component Tests', () => {
  describe('ProductStyleHistory Management Component', () => {
    let comp: ProductStyleHistoryComponent;
    let fixture: ComponentFixture<ProductStyleHistoryComponent>;
    let service: ProductStyleHistoryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MallTestModule],
        declarations: [ProductStyleHistoryComponent]
      })
        .overrideTemplate(ProductStyleHistoryComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProductStyleHistoryComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ProductStyleHistoryService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new ProductStyleHistory(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.productStyleHistories && comp.productStyleHistories[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
