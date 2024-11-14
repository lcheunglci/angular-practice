import { Injectable } from '@angular/core';
import { Exercise } from './exercise.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  private availableExercises: Exercise[] = [
    {
      id: 'crunches',
      name: 'Crunches',
      duration: 30,
      calories: 8,
      state: null,
    },
    {
      id: 'touch-toes',
      name: 'Touch Toes',
      duration: 180,
      calories: 15,
      state: null,
    },
    {
      id: 'side-lunges',
      name: 'Side Lunges',
      duration: 120,
      calories: 18,
      state: null,
    },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 8, state: null },
  ];

  private runningExercise?: Exercise | null = null;

  constructor() {}

  getAvailableExercises() {
    return this.availableExercises.slice();
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(
      (ex) => ex.id === selectedId
    );
    if (this.runningExercise) {
      this.exerciseChanged.next({ ...this.runningExercise });
    }
  }
}
