import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigimonStatsAllocationComponent } from './digimon-stats-allocation.component';

describe('DigimonStatsAllocationComponent', () => {
  let component: DigimonStatsAllocationComponent;
  let fixture: ComponentFixture<DigimonStatsAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigimonStatsAllocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DigimonStatsAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
