import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AITravelPlannerComponent } from './ai-travel-planner/ai-travel-planner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AITravelPlannerComponent],
  template: '<router-outlet></router-outlet><app-ai-travel-planner></app-ai-travel-planner>', // Ensure both are included
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('travel-planner');
}