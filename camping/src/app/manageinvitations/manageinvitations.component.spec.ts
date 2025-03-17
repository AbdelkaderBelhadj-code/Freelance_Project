import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageinvitationsComponent } from './manageinvitations.component';

describe('ManageinvitationsComponent', () => {
  let component: ManageinvitationsComponent;
  let fixture: ComponentFixture<ManageinvitationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageinvitationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageinvitationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
