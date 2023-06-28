import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchSelectionComponent } from './match-selection.component';

describe('MatchSelectionComponent', () => {
  let component: MatchSelectionComponent;
  let fixture: ComponentFixture<MatchSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
