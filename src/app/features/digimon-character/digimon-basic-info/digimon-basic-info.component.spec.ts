import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigimonBasicInfoComponent } from './digimon-basic-info.component';

describe('DigimonBasicInfoComponent', () => {
  let component: DigimonBasicInfoComponent;
  let fixture: ComponentFixture<DigimonBasicInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigimonBasicInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DigimonBasicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
