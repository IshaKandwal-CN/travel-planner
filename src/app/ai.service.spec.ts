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
    let result = '';
    await service.generateItineraryStream('Paris', 5, 5000, 2, {luxury: true}, (chunk: string) => {
      result += chunk;
    });
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });
});
