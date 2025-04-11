import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorkoutApiService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getWorkouts() {
    return this.http.get<any[]>(`${this.baseUrl}/workouts`).pipe(
      tap((data) => {
        console.log('getWorkouts', data);
      })
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
}
