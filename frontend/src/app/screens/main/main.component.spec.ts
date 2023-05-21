import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MainComponent } from './main.component';
import { HorseComponent } from '../../widget//horse/horse.component';
import { FormStringPipe, } from '../../model/pipehelpers';
import { CurrencyPipe } from '@angular/common';

describe('MainComponent', () => {
    let component: MainComponent;
    let fixture: ComponentFixture<MainComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [ MainComponent, HorseComponent, FormStringPipe],
            providers: [CurrencyPipe]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MainComponent);
        component = fixture.componentInstance;
        component.commonService.setInitialized();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
