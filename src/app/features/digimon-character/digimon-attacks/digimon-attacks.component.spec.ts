import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigimonAttacksComponent } from './digimon-attacks.component';

describe('DigimonAttacksComponent', () => {
  let component: DigimonAttacksComponent;
  let fixture: ComponentFixture<DigimonAttacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigimonAttacksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DigimonAttacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
