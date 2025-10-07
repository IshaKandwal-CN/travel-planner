import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

export interface ItineraryPreferences {
  [key: string]: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private backendUrl = 'http://127.0.0.1:8000/api/generate-itinerary';

  constructor(private http: HttpClient) {}

  /**
   * Generate a travel itinerary
   * @param destination Destination city/country
   * @param duration Duration in days
   * @param budget Budget in USD
   * @param travelers Number of travelers
   * @param preferences Travel preferences (sightseeing, food, adventure, etc.)
   * @param onChunk Callback for chunked output (currently sends full itinerary)
   */
  async generateItineraryStream(
    destination: string,
    duration: number,
    budget: number,
    travelers: number,
    preferences: ItineraryPreferences,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    try {
      // Send POST request to FastAPI backend
      const response: any = await lastValueFrom(
        this.http.post(this.backendUrl, {
          destination,
          duration,
          budget,
          travelers,
          preferences,
        })
      );

      // Currently backend returns full itinerary in one go
      onChunk(response.itinerary);

    } catch (error: any) {
      console.error('Error generating itinerary:', error);
      onChunk('⚠️ Failed to generate itinerary. Please try again.');
    }
  }
}
