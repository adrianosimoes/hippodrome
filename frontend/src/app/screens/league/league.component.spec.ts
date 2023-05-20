import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { LeagueComponent } from './league.component';
import { FormStringPipe, RaceDifficultyPipe } from '../../model/pipehelpers';
import { CurrencyPipe } from '@angular/common';


describe('LeagueComponent', () => {
    let component: LeagueComponent;
    let fixture: ComponentFixture<LeagueComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [ LeagueComponent, RaceDifficultyPipe],
            providers: [CurrencyPipe]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LeagueComponent);
        component = fixture.componentInstance;
        component.commonService.setInitialized();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
