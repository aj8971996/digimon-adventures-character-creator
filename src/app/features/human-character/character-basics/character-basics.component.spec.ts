import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterBasicsComponent } from './character-basics.component';

describe('CharacterBasicsComponent', () => {
  let component: CharacterBasicsComponent;
  let fixture: ComponentFixture<CharacterBasicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterBasicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterBasicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
