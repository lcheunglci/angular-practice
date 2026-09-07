import { TestBed } from '@angular/core/testing';

import { GeometryService } from './geometry-service';

describe('GeometryService', () => {
  let service: GeometryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    // This will instantiate the service for us
    service = TestBed.inject(GeometryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate the circle area correctly', () => {
    // Arrange (input)
    const radius = 5;

    // Act
    const area = service.calculateCircleArea(radius);
 
    // Assert
    expect(area).toBeCloseTo(78.5398);
  });
});
