import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmChat } from './dm-chat';

describe('DmChat', () => {
  let component: DmChat;
  let fixture: ComponentFixture<DmChat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DmChat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DmChat);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
