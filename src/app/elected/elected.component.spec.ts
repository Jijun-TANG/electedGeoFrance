import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectedComponent } from './elected.component';

describe('ElectedComponent', () => {
  let component: ElectedComponent;
  let fixture: ComponentFixture<ElectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
