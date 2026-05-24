import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminResenas } from './admin-resenas';

describe('AdminResenas', () => {
  let component: AdminResenas;
  let fixture: ComponentFixture<AdminResenas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminResenas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminResenas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
