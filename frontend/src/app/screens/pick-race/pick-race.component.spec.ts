import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PickRaceComponent } from './pick-race.component';
import { FormStringPipe, RaceDifficultyPipe } from '../../model/pipehelpers';


describe('PickRaceComponent', () => {
  let component: PickRaceComponent;
  let fixture: ComponentFixture<PickRaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ PickRaceComponent, RaceDifficultyPipe]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickRaceComponent);
    component = fixture.componentInstance;
    component.commonService.setInitialized();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
