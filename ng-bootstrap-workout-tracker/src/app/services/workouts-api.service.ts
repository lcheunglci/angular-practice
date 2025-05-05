import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorkoutsApiService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getWorkouts() {
    return this.http.get<any[]>(`${this.baseUrl}/workouts`).pipe(
      tap((data) => {
        console.log('getWorkouts', data);
      })
    );
  }

  getWorkoutsPaged(currPage: number, pageSize: number) {
    return this.http.get<any[]>(
      `${this.baseUrl}/workouts?_page=${currPage}&_limit=${pageSize}`
    );
  }

  getWorkout(id: number) {
    return this.http.get<any[]>(`${this.baseUrl}/workouts/${id}`).pipe(
      tap((data) => {
        console.log('getWorkout', data);
      })
    );
  }

  addWorkout(workout: any) {
    return this.http.post(`${this.baseUrl}/workouts`, workout);
  }

  updateWorkout(workout: any) {
    return this.http.put(`${this.baseUrl}/workouts/${workout.id}`, workout);
  }

  saveWorkout(workout: any) {
    if (workout.id) {
      return this.updateWorkout(workout);
    } else {
      return this.addWorkout(workout);
    }
  }

  deleteWorkout(id: number) {
    return this.http.delete(`${this.baseUrl}/workouts/${id}`);
  }

  getLocations() {
    return this.http.get<any[]>(`${this.baseUrl}/locations`);
  }

  searchLocations(searchTerm: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/locations?q=${searchTerm}`);
  }

  getPerfTargets() {
    return this.http.get(`${this.baseUrl}/performanceTargets`);
  }

  savePerfTargets(perfTargets: any) {
    return this.http.put(`${this.baseUrl}/performanceTargets`, perfTargets);
  }
}
