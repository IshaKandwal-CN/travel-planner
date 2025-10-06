import { Injectable, inject } from '@angular/core';
import { Auth, authState, onAuthStateChanged } from '@angular/fire/auth';
import { signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  public user$: Observable<User | null> = authState(this.auth);
  public error$ = new BehaviorSubject<string | null>(null);

  constructor() {
    // Note: onAuthStateChanged is already handled by authState()
    // This is optional/redundant but can be useful for logging
    onAuthStateChanged(this.auth, (user) => {
      if (!user) {
        console.log('User logged out or not authenticated');
      }
    });
  }

  isAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }

  getUser(): User | null {
    return this.auth.currentUser;
  }

  async loginWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(this.auth, provider);
      this.error$.next(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.error$.next(message);
      throw error; // Re-throw for component to handle
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.error$.next(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.error$.next(message);
      throw error;
    }
  }
}