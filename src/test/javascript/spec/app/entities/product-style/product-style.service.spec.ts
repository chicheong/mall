import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductStyleService } from 'app/entities/product-style/product-style.service';
import { IProductStyle, ProductStyle } from 'app/shared/model/product-style.model';
import { ProductStyleType } from 'app/shared/model/enumerations/product-style-type.model';

describe('Service Tests', () => {
  describe('ProductStyle Service', () => {
    let injector: TestBed;
    let service: ProductStyleService;
    let httpMock: HttpTestingController;
    let elemDefault: IProductStyle;
    let expectedResult: IProductStyle | IProductStyle[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(ProductStyleService);
      httpMock = injector.get(HttpTestingController);

      elemDefault = new ProductStyle(0, 'AAAAAAA', 'AAAAAAA', false, ProductStyleType.COLOR);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a ProductStyle', () => {
        const returnedFromService = Object.assign(
          {
            id: 0
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new ProductStyle()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a ProductStyle', () => {
        const returnedFromService = Object.assign(
          {
            name: 'BBBBBB',
            code: 'BBBBBB',
            isDefault: true,
            type: 'BBBBBB'
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of ProductStyle', () => {
        const returnedFromService = Object.assign(
          {
            name: 'BBBBBB',
            code: 'BBBBBB',
            isDefault: true,
            type: 'BBBBBB'
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a ProductStyle', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
