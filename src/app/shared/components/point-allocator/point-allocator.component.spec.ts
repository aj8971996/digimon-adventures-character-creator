import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointAllocatorComponent } from './point-allocator.component';

describe('PointAllocatorComponent', () => {
  let component: PointAllocatorComponent;
  let fixture: ComponentFixture<PointAllocatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PointAllocatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointAllocatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
