import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Amistades } from './amistades';

describe('Amistades', () => {
  let component: Amistades;
  let fixture: ComponentFixture<Amistades>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Amistades]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Amistades);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
