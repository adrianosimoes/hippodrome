import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickRaceComponent } from './pick-race.component';

describe('PickRaceComponent', () => {
  let component: PickRaceComponent;
  let fixture: ComponentFixture<PickRaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickRaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickRaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
