import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../auth.service';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-ai-travel-planner',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './ai-travel-planner.html',
  styleUrls: ['./ai-travel-planner.css']
})
export class AITravelPlannerComponent {
  step: string = 'input';
  budget: number = 5000;
  destination: string = '';
  travelers: number = 2;
  duration: number = 7;
  preferences: { [key: string]: boolean } = {
    luxury: false,
    adventure: false,
    cultural: false,
    relaxation: false,
    foodie: false
  };
  activeDay: number = 1;
  itineraryText: string = ''; // Added property to fix template error

  constructor(public authService: AuthService, @Inject(FirestoreService) private firestoreService: FirestoreService) {}

  get mockItinerary() {
    return {
      destination: this.destination || 'Paris, France',
      totalCost: this.budget * 0.85,
      savings: this.budget * 0.15,
      flights: { departure: '10:30 AM - Air France', arrival: '2:45 PM Local', price: 850 },
      hotel: { name: 'Le Marais Boutique Hotel', rating: 4.5, price: 180, nights: this.duration },
      days: Array.from({ length: this.duration }, (_, i) => ({
        day: i + 1,
        activities: [
          { time: '9:00 AM', title: 'Breakfast at Hotel', icon: '🥐' },
          { time: '10:30 AM', title: i % 2 === 0 ? 'Eiffel Tower Visit' : 'Louvre Museum Tour', icon: '🎨' },
          { time: '1:00 PM', title: 'Lunch at Local Bistro', icon: '🍽️' },
          { time: '3:00 PM', title: i % 2 === 0 ? 'Seine River Cruise' : 'Montmartre Walk', icon: '⛵' },
          { time: '7:00 PM', title: 'Dinner Reservation', icon: '🌟' }
        ]
      }))
    };
  }

  generateItinerary(): void {
    if (!this.authService.isAuthenticated()) {
      this.authService.error$.next('Please log in to generate a trip.');
      return;
    }

    this.step = 'loading';
    const tripData = {
      destination: this.destination,
      budget: this.budget,
      travelers: this.travelers,
      duration: this.duration,
      preferences: this.preferences,
      itinerary: this.mockItinerary
    };
    this.firestoreService.addPlan(tripData).then(() => {
      setTimeout(() => {
        this.step = 'results';
      }, 2000);
    }).catch((err: any) => {
      this.authService.error$.next(err.message);
      this.step = 'input';
    });
  }

  togglePreference(pref: string): void {
    this.preferences[pref] = !this.preferences[pref];
  }

  setStep(step: string): void {
    this.step = step;
  }

  setActiveDay(day: number): void {
    this.activeDay = day;
  }

  login(): void {
    this.authService.loginWithGoogle();
  }

  logout(): void {
    this.authService.logout();
  }
}
