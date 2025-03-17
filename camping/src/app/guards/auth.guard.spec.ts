import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { of } from 'rxjs';

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
}

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let socialAuthService: MockSocialAuthService;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: SocialAuthService, useClass: MockSocialAuthService }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    socialAuthService = TestBed.inject(SocialAuthService) as unknown as MockSocialAuthService;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  // Add more tests to cover different scenarios
});
