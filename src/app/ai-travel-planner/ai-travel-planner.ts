import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../auth.service';
import { FirestoreService } from '../firestore.service';
import { AiService } from '../ai.service';

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
  itineraryText: string = ''; // live streaming text

  constructor(
    public authService: AuthService,
    private firestoreService: FirestoreService,
    private aiService: AiService,
    private ngZone: NgZone // Inject NgZone
  ) {}

  // Mock itinerary for testing UI
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

  // Generate itinerary with live streaming
  async generateItinerary(): Promise<void> {
    if (!this.authService.isAuthenticated()) {
      this.authService.error.set('Please log in to generate a trip.');

      return;
    }

    this.step = 'loading';
    this.itineraryText = ''; // clear previous result
    let finalText = '';

    try {
      // Stream partial chunks as they arrive
      await this.aiService.generateItineraryStream(
        this.destination,
        this.duration,
        this.budget,
        this.travelers,
        this.preferences,
        (chunk: string) => {
          // Run UI updates inside Angular's zone to ensure change detection
          this.ngZone.run(() => {
            this.itineraryText += chunk;
          });
        }
      );

      // After streaming finishes, save full text
      finalText = this.itineraryText;

      const tripData = {
        destination: this.destination,
        budget: this.budget,
        travelers: this.travelers,
        duration: this.duration,
        preferences: this.preferences,
        itinerary: finalText
      };

      await this.firestoreService.addPlan(tripData);
      this.step = 'results';
    } catch (err: any) {
      console.error('Streaming error:', err);
      // Ensure error state updates are also within the zone
      this.ngZone.run(() => {
        this.authService.error.set(err.message || 'Failed to generate itinerary');

        this.step = 'input';
      });
    }
  }

  // Toggle travel preference
  togglePreference(pref: string): void {
    this.preferences[pref] = !this.preferences[pref];
  }

  // Login via auth service
  login(): void {
    this.authService.loginWithGoogle();
  }

  // Logout via auth service
  logout(): void {
    this.authService.logout();
  }

  // Change step state
  setStep(step: string): void {
    this.step = step;
  }

  // Set active day for itinerary UI
  setActiveDay(day: number): void {
    this.activeDay = day;
  }
}
