import { Injectable, signal } from '@angular/core';
import { Auth, authState, signInWithRedirect, GoogleAuthProvider, signOut, User, getRedirectResult } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Signals for reactive state
  public user = signal<User | null>(null);
  public error = signal<string | null>(null);

  // Observable for template subscriptions if needed
  public user$: Observable<User | null>;

  constructor(private auth: Auth) {
    // Expose observable for template usage
    this.user$ = authState(this.auth);

    // Subscribe to auth state changes
    this.user$.subscribe((u) => {
      this.user.set(u);
    });

    // Handle redirect result for errors
    getRedirectResult(this.auth).catch((error) => {
      this.error.set(error.message || 'Login failed');
    });
  }

  isAuthenticated(): boolean {
    return !!this.user();
  }

  getUser(): User | null {
    return this.user();
  }

  loginWithGoogle(): void {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(this.auth, provider);
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.user.set(null);
      this.error.set(null);
    } catch (e: any) {
      this.error.set(e.message || 'Unknown logout error');
    }
  }
}
