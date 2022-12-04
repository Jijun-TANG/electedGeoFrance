import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchRegionComponent } from './search-region.component';

describe('SearchRegionComponent', () => {
  let component: SearchRegionComponent;
  let fixture: ComponentFixture<SearchRegionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchRegionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
