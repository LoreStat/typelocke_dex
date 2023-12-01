import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypesCombinationsComponent } from './types-combinations.component';

describe('TypesCombinationsComponent', () => {
  let component: TypesCombinationsComponent;
  let fixture: ComponentFixture<TypesCombinationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypesCombinationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypesCombinationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
