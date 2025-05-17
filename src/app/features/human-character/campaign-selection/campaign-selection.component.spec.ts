import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignSelectionComponent } from './campaign-selection.component';

describe('CampaignSelectionComponent', () => {
  let component: CampaignSelectionComponent;
  let fixture: ComponentFixture<CampaignSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaignSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
