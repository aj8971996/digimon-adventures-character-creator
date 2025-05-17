import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TormentsComponent } from './torments.component';

describe('TormentsComponent', () => {
  let component: TormentsComponent;
  let fixture: ComponentFixture<TormentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TormentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TormentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
