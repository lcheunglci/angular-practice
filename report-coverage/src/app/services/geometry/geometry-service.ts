import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeometryService {
  // No explicitly injected services.

  constructor() {
    // Empty constructor because no other service is needed.
  }

  calculateCircleArea(radius: number): number {
    if (radius <= 0) return 0;

    return Math.PI * radius * radius;
  }

  feetToMeters(feet: number): number {
    if (feet < 0) return 0;

    const conversionFactor = 0.3048;
    return feet * conversionFactor;
  }
}