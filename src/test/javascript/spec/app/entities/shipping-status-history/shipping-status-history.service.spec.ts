import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { ShippingStatusHistoryService } from 'app/entities/shipping-status-history/shipping-status-history.service';
import { IShippingStatusHistory, ShippingStatusHistory } from 'app/shared/model/shipping-status-history.model';
import { ShippingStatus } from 'app/shared/model/enumerations/shipping-status.model';

describe('Service Tests', () => {
  describe('ShippingStatusHistory Service', () => {
    let injector: TestBed;
    let service: ShippingStatusHistoryService;
    let httpMock: HttpTestingController;
    let elemDefault: IShippingStatusHistory;
    let expectedResult: IShippingStatusHistory | IShippingStatusHistory[] | boolean | null;
    let currentDate: moment.Moment;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(ShippingStatusHistoryService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new ShippingStatusHistory(0, currentDate, ShippingStatus.PENDING);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            effectiveDate: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a ShippingStatusHistory', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            effectiveDate: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            effectiveDate: currentDate
          },
          returnedFromService
        );

        service.create(new ShippingStatusHistory()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a ShippingStatusHistory', () => {
        const returnedFromService = Object.assign(
          {
            effectiveDate: currentDate.format(DATE_TIME_FORMAT),
            status: 'BBBBBB'
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            effectiveDate: currentDate
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of ShippingStatusHistory', () => {
        const returnedFromService = Object.assign(
          {
            effectiveDate: currentDate.format(DATE_TIME_FORMAT),
            status: 'BBBBBB'
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            effectiveDate: currentDate
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a ShippingStatusHistory', () => {
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
