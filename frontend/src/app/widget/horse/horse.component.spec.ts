import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { FormStringPipe, RaceDifficultyPipe } from '../../model/pipehelpers';
import { HorseComponent } from './horse.component';
import { Horse } from '../../model/horse';
import { CurrencyPipe } from '@angular/common';


describe('HorseComponent', () => {
    let component: HorseComponent;
    let fixture: ComponentFixture<HorseComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [ HorseComponent, FormStringPipe],
            providers: [CurrencyPipe]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HorseComponent);
        component = fixture.componentInstance;
        component.horse = new Horse(1, 'aaa', 10, 10, 11, 10);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
