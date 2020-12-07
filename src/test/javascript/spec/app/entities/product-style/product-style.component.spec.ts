import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MallTestModule } from '../../../test.module';
import { ProductStyleComponent } from 'app/entities/product-style/product-style.component';
import { ProductStyleService } from 'app/entities/product-style/product-style.service';
import { ProductStyle } from 'app/shared/model/product-style.model';

describe('Component Tests', () => {
  describe('ProductStyle Management Component', () => {
    let comp: ProductStyleComponent;
    let fixture: ComponentFixture<ProductStyleComponent>;
    let service: ProductStyleService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MallTestModule],
        declarations: [ProductStyleComponent]
      })
        .overrideTemplate(ProductStyleComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProductStyleComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ProductStyleService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new ProductStyle(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.productStyles && comp.productStyles[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
