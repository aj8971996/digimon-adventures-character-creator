import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributesAllocationComponent } from './attributes-allocation.component';

describe('AttributesAllocationComponent', () => {
  let component: AttributesAllocationComponent;
  let fixture: ComponentFixture<AttributesAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributesAllocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttributesAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
