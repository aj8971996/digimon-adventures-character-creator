import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DerivedStatsComponent } from './derived-stats.component';

describe('DerivedStatsComponent', () => {
  let component: DerivedStatsComponent;
  let fixture: ComponentFixture<DerivedStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DerivedStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DerivedStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
