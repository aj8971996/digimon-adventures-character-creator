import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigimonCharacterSummaryComponent } from './digimon-character-summary.component';

describe('DigimonCharacterSummaryComponent', () => {
  let component: DigimonCharacterSummaryComponent;
  let fixture: ComponentFixture<DigimonCharacterSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigimonCharacterSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DigimonCharacterSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
