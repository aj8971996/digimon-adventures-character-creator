import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsAllocationComponent } from './skills-allocation.component';

describe('SkillsAllocationComponent', () => {
  let component: SkillsAllocationComponent;
  let fixture: ComponentFixture<SkillsAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsAllocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillsAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
