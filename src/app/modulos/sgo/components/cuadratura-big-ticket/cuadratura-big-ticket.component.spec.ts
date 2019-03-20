import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuadraturaBigTicketComponent } from './cuadratura-big-ticket.component';

describe('CuadraturaBigTicketComponent', () => {
  let component: CuadraturaBigTicketComponent;
  let fixture: ComponentFixture<CuadraturaBigTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuadraturaBigTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuadraturaBigTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
