import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { CurrencyRateService } from 'app/entities/currency-rate/currency-rate.service';
import { ICurrencyRate, CurrencyRate } from 'app/shared/model/currency-rate.model';
import { CurrencyType } from 'app/shared/model/enumerations/currency-type.model';

describe('Service Tests', () => {
  describe('CurrencyRate Service', () => {
    let injector: TestBed;
    let service: CurrencyRateService;
    let httpMock: HttpTestingController;
    let elemDefault: ICurrencyRate;
    let expectedResult: ICurrencyRate | ICurrencyRate[] | boolean | null;
    let currentDate: moment.Moment;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(CurrencyRateService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new CurrencyRate(0, currentDate, currentDate, 0, CurrencyType.HKD, CurrencyType.HKD);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            from: currentDate.format(DATE_TIME_FORMAT),
            to: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a CurrencyRate', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            from: currentDate.format(DATE_TIME_FORMAT),
            to: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            from: currentDate,
            to: currentDate
          },
          returnedFromService
        );

        service.create(new CurrencyRate()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a CurrencyRate', () => {
        const returnedFromService = Object.assign(
          {
            from: currentDate.format(DATE_TIME_FORMAT),
            to: currentDate.format(DATE_TIME_FORMAT),
            rate: 1,
            sourceCurrency: 'BBBBBB',
            targetCurrency: 'BBBBBB'
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            from: currentDate,
            to: currentDate
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of CurrencyRate', () => {
        const returnedFromService = Object.assign(
          {
            from: currentDate.format(DATE_TIME_FORMAT),
            to: currentDate.format(DATE_TIME_FORMAT),
            rate: 1,
            sourceCurrency: 'BBBBBB',
            targetCurrency: 'BBBBBB'
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            from: currentDate,
            to: currentDate
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a CurrencyRate', () => {
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
