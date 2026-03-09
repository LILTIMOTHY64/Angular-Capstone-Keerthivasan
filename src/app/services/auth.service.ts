import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

// User roles: 'buyer' for shopping, 'owner' for managing products
export type UserRole = 'buyer' | 'owner';

// Authenticated user data
export interface AuthUser {
  // Keep most fields optional so we can persist a minimal subset to storage
  id?: number;
  username: string;
  displayName?: string;
  email?: string;
  role: UserRole;
  accessToken?: string;
  refreshToken?: string;
}

// Minimal shape we persist to localStorage. We only store what's required
// for login to function on reload: username, role, displayName, and accessToken.
interface StoredAuth {
  username: string;
  role: UserRole;
  displayName?: string;
  accessToken?: string;
}

// DummyJSON login response
interface DummyJsonLoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  accessToken: string;
  refreshToken: string;
  [key: string]: any;
}

// Role assignments and storage key are private to AuthService

/**
 * Manages user authentication and authorization with DummyJSON API
 * State: user signal + computed derived signals (isLoggedIn, isOwner, isBuyer)
 * Persistence: localStorage for session recovery on reload
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  // Role assignments for DummyJSON users (private to this service)
  private static readonly USER_ROLES: Record<string, UserRole> = {
    emilys: 'buyer', // Emily Johnson - Buyer
    michaelw: 'owner', // Michael Williams - Owner (product manager)
  };

  // Key for localStorage session persistence (private to this service)
  private static readonly STORAGE_KEY = 'flopkart_user';

  private readonly http = inject(HttpClient);

  // Core state: current authenticated user or null
  private readonly user = signal<AuthUser | null>(this.restoreSession());

  // Public signals for components
  readonly userSelected = this.user.asReadonly(); // Read-only signal for current user
  readonly isLoggedIn = computed(() => this.user() !== null); // Indicates if a user is logged in
  readonly isOwner = computed(() => this.user()?.role === 'owner'); // Indicates if the user is an owner
  readonly isBuyer = computed(() => this.user()?.role === 'buyer'); // Indicates if the user is a buyer
  readonly displayName = computed(() => this.user()?.displayName ?? ''); // User's display name

  /**
   * Authenticates user via DummyJSON API
   * POST /auth/login with username and password
   * Returns Observable that emits void on success
   */
  login(username: string, password: string): Observable<void> {
    return this.http
      .post<DummyJsonLoginResponse>('https://dummyjson.com/auth/login', {
        username,
        password,
        expiresInMins: 30,
      })
      .pipe(
        // Handle successful login
        tap((response) => {
          // Assign role based on username
          const role = AuthService.USER_ROLES[username] || 'buyer';
          // Create AuthUser object
          const user: AuthUser = {
            id: response.id,
            username: response.username,
            displayName: `${response.firstName} ${response.lastName}`,
            email: response.email,
            role: role,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          };
          // Update user signal
          this.user.set(user);

          // Persist only the minimal data required for session restore
          const stored: StoredAuth = {
            username: user.username,
            role: user.role,
            displayName: user.displayName,
            accessToken: user.accessToken,
          };
          localStorage.setItem(AuthService.STORAGE_KEY, JSON.stringify(stored));
        }),
        // Convert to void
        map(() => undefined),
        catchError((error) => {
          console.error('Login failed:', error);
          return throwError(() => new Error('Invalid username or password'));
        }),
      );
  }

  // Clears user session and localStorage
  logout(): void {
    this.user.set(null);
    localStorage.removeItem(AuthService.STORAGE_KEY);
  }

  // Restores session from localStorage on app startup
  private restoreSession(): AuthUser | null {
    try {
      const raw = localStorage.getItem(AuthService.STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<StoredAuth>;
      // We only require username and role to restore a usable session
      if (!parsed.username || !parsed.role) return null;

      // Reconstruct a minimal AuthUser from stored data. displayName is
      // persisted and will be restored if present so the UI can show it.
      const restored: AuthUser = {
        username: parsed.username,
        role: parsed.role,
        displayName: parsed.displayName,
        accessToken: parsed.accessToken,
      };
      return restored;
    } catch {
      return null;
    }
  }
}
