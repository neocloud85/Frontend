import { TestBed } from '@angular/core/testing';

import { DaminMensajes } from './damin-mensajes';

describe('DaminMensajes', () => {
  let service: DaminMensajes;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DaminMensajes);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
