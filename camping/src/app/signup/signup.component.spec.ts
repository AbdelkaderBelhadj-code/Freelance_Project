/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

import { SignupComponent } from './signup.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { SocialAuthService, SocialAuthServiceConfig } from 'angularx-social-login';
import { SocialUser } from '@abacritt/angularx-social-login';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupComponent ],imports: [HttpClientTestingModule],      schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],

      providers: [
        MatDialog, // Add MatDialog to providers
        {
          provide: SocialAuthService,
          useValue: {
            authState: {
              subscribe: () => {},
            },
            signIn: () => Promise.resolve({
              id: 'test-id',
              name: 'Test User',
              email: 'test@example.com',
              photoUrl: 'https://example.com/photo.jpg',
              firstName: 'Test',
              lastName: 'User',
              authToken: 'test-auth-token',
              idToken: 'test-id-token',
            } as SocialUser),
          }
        },
        {
          provide: 'SocialAuthServiceConfig',
          useValue: {
            autoLogin: false,
            providers: []
          } as SocialAuthServiceConfig,
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
