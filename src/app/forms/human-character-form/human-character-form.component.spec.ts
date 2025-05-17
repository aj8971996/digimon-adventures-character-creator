import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanCharacterFormComponent } from './human-character-form.component';

describe('HumanCharacterFormComponent', () => {
  let component: HumanCharacterFormComponent;
  let fixture: ComponentFixture<HumanCharacterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HumanCharacterFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HumanCharacterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
