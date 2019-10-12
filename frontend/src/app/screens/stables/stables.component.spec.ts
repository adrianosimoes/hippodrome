import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormStringPipe, RaceDifficultyPipe } from '../../model/pipehelpers';

import { StablesComponent } from './stables.component';
import { HorseComponent } from '../../widget//horse/horse.component';
import { CommonService } from '../../model/services/common.service';
import { CurrencyPipe } from "@angular/common";


describe('StablesComponent', () => {
  let component: StablesComponent;
  let fixture: ComponentFixture<StablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ StablesComponent, HorseComponent, FormStringPipe],
      providers: [CurrencyPipe]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StablesComponent);
    component = fixture.componentInstance;
    component.commonService.setInitialized();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
