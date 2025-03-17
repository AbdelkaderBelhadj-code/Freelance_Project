import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

class MockSocialAuthService {
  authState = of({
    id: '1',
    name: 'Test User',
    provider: 'test',
    email: 'test@example.com',
    photoUrl: 'https://example.com/test.jpg',
    firstName: 'Test',
    lastName: 'User',
    authToken: 'test_auth_token',
    idToken: 'test_id_token',
    authorizationCode: 'test_auth_code',
    response: {
      access_token: 'test_access_token',
      expires_in: 3600,
      token_type: 'Bearer'
    }
  } as SocialUser);

  signIn() {
    return Promise.resolve(this.authState);
  }

  signOut() {
    return Promise.resolve();
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        RouterTestingModule, // Import RouterTestingModule
        HttpClientTestingModule
      ],
      providers: [
        { provide: SocialAuthService, useClass: MockSocialAuthService }
      ],      schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],

    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
