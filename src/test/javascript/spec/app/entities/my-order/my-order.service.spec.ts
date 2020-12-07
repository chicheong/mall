import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MyOrderService } from 'app/entities/my-order/my-order.service';
import { IMyOrder, MyOrder } from 'app/shared/model/my-order.model';
import { CurrencyType } from 'app/shared/model/enumerations/currency-type.model';
import { OrderStatus } from 'app/shared/model/enumerations/order-status.model';

describe('Service Tests', () => {
  describe('MyOrder Service', () => {
    let injector: TestBed;
    let service: MyOrderService;
    let httpMock: HttpTestingController;
    let elemDefault: IMyOrder;
    let expectedResult: IMyOrder | IMyOrder[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(MyOrderService);
      httpMock = injector.get(HttpTestingController);

      elemDefault = new MyOrder(0, 0, CurrencyType.HKD, 'AAAAAAA', OrderStatus.PENDING);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a MyOrder', () => {
        const returnedFromService = Object.assign(
          {
            id: 0
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new MyOrder()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a MyOrder', () => {
        const returnedFromService = Object.assign(
          {
            total: 1,
            currency: 'BBBBBB',
            remark: 'BBBBBB',
            status: 'BBBBBB'
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of MyOrder', () => {
        const returnedFromService = Object.assign(
          {
            total: 1,
            currency: 'BBBBBB',
            remark: 'BBBBBB',
            status: 'BBBBBB'
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

      it('should delete a MyOrder', () => {
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
