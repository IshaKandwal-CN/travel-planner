import { TestBed } from '@angular/core/testing';
import { AITravelPlannerComponent } from './ai-travel-planner';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { importProvidersFrom } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';

describe('AITravelPlannerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AITravelPlannerComponent, CommonModule, FormsModule, MatIconModule],
      providers: [
        importProvidersFrom(AngularFireModule.initializeApp(environment.firebaseConfig))
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AITravelPlannerComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});