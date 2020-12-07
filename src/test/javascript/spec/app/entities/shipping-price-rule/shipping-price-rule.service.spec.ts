import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ShippingPriceRuleService } from 'app/entities/shipping-price-rule/shipping-price-rule.service';
import { IShippingPriceRule, ShippingPriceRule } from 'app/shared/model/shipping-price-rule.model';
import { ShippingPriceRuleType } from 'app/shared/model/enumerations/shipping-price-rule-type.model';

describe('Service Tests', () => {
  describe('ShippingPriceRule Service', () => {
    let injector: TestBed;
    let service: ShippingPriceRuleService;
    let httpMock: HttpTestingController;
    let elemDefault: IShippingPriceRule;
    let expectedResult: IShippingPriceRule | IShippingPriceRule[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(ShippingPriceRuleService);
      httpMock = injector.get(HttpTestingController);

      elemDefault = new ShippingPriceRule(0, ShippingPriceRuleType.FIXED_PER_ORDER, 0, 0, 0);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a ShippingPriceRule', () => {
        const returnedFromService = Object.assign(
          {
            id: 0
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new ShippingPriceRule()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a ShippingPriceRule', () => {
        const returnedFromService = Object.assign(
          {
            type: 'BBBBBB',
            value: 1,
            price: 1,
            sequence: 1
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of ShippingPriceRule', () => {
        const returnedFromService = Object.assign(
          {
            type: 'BBBBBB',
            value: 1,
            price: 1,
            sequence: 1
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

      it('should delete a ShippingPriceRule', () => {
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
