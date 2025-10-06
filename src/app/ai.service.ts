import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  constructor() {}

  async generateItinerary(destination: string, duration: number, budget: number): Promise<string> {
    // Placeholder implementation for AI itinerary generation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          `Your AI-generated itinerary for ${destination} for ${duration} days with a budget of $${budget} is ready!`
        );
      }, 1000);
    });
  }
}