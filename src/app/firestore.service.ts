import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, CollectionReference } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface TravelPlan {
  destination: string;
  budget: number;
  travelers: number;
  duration: number;
  preferences: { [key: string]: boolean };
  itinerary: any;
  createdAt?: Date;
  id?: string;
}

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  private firestore = inject(Firestore);
  private auth = inject(AuthService);

  async addPlan(plan: TravelPlan): Promise<any> {
    const user = this.auth.getUser();
    if (!user) throw new Error('User not logged in');

    const plansRef = collection(this.firestore, `users/${user.uid}/plans`);
    return await addDoc(plansRef, {
      ...plan,
      createdAt: new Date()
    });
  }

  getPlans(): Observable<TravelPlan[]> {
    return this.auth.user$.pipe(
      switchMap(user => {
        if (!user) return of([]);
        const plansRef = collection(this.firestore, `users/${user.uid}/plans`);
        return collectionData(plansRef, { idField: 'id' }) as Observable<TravelPlan[]>;
      })
    );
  }
}
