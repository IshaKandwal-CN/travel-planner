import { TestBed } from '@angular/core/testing';
import { AiService } from './ai.service';

describe('AiService', () => {
  let service: AiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate itinerary', async () => {
    const result = await service.generateItinerary('Paris', 5, 5000);
    expect(result).toContain('Paris');
    expect(result).toContain('5');
    expect(result).toContain('5000');
  });
});