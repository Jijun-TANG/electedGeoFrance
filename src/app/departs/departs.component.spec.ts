import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartsComponent } from './departs.component';

describe('DepartsComponent', () => {
  let component: DepartsComponent;
  let fixture: ComponentFixture<DepartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
