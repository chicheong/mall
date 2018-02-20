/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MallTestModule } from '../../../test.module';
import { MyAccountComponent } from '../../../../../../main/webapp/app/entities/my-account/my-account.component';
import { MyAccountService } from '../../../../../../main/webapp/app/entities/my-account/my-account.service';
import { MyAccount } from '../../../../../../main/webapp/app/entities/my-account/my-account.model';

describe('Component Tests', () => {

    describe('MyAccount Management Component', () => {
        let comp: MyAccountComponent;
        let fixture: ComponentFixture<MyAccountComponent>;
        let service: MyAccountService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MallTestModule],
                declarations: [MyAccountComponent],
                providers: [
                    MyAccountService
                ]
            })
            .overrideTemplate(MyAccountComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(MyAccountComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MyAccountService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new MyAccount(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.myAccounts[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
