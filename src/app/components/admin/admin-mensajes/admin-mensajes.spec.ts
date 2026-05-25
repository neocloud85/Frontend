import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMensajes } from './admin-mensajes';

describe('AdminMensajes', () => {
  let component: AdminMensajes;
  let fixture: ComponentFixture<AdminMensajes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMensajes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMensajes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
