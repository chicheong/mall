/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { MallTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { OfficeDetailComponent } from '../../../../../../main/webapp/app/entities/office/office-detail.component';
import { OfficeService } from '../../../../../../main/webapp/app/entities/office/office.service';
import { Office } from '../../../../../../main/webapp/app/entities/office/office.model';

describe('Component Tests', () => {

    describe('Office Management Detail Component', () => {
        let comp: OfficeDetailComponent;
        let fixture: ComponentFixture<OfficeDetailComponent>;
        let service: OfficeService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [OfficeDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    OfficeService,
                    JhiEventManager
                ]
            }).overrideTemplate(OfficeDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(OfficeDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OfficeService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Office(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.office).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
