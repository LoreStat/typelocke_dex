import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeaknessesComponent } from './weaknesses.component';

describe('WeaknessesComponent', () => {
  let component: WeaknessesComponent;
  let fixture: ComponentFixture<WeaknessesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeaknessesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeaknessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
