import { Injectable } from '@angular/core';
import { Exercise } from './exercise.model';
import { map, Subject } from 'rxjs';
import {
  collectionChanges,
  collectionData,
  collectionSnapshots,
} from '@angular/fire/firestore';
import { collection, Firestore } from '@angular/fire/firestore/firebase';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  exerciseChanged = new Subject<Exercise | null>();
  exercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];

  private runningExercise: Exercise | null = null;
  private exercises: Exercise[] = [];

  constructor(private db: Firestore, private firestore: AngularFirestore) {}

  fetchAvailableExercises() {
    const itemCollection = collection(this.db, 'availableExercises');
    return collectionSnapshots(itemCollection)
      .pipe(
        map((docArray) => {
          return docArray.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            } as Exercise;
          });
        })
      )
      .subscribe((exercises: Exercise[]) => {
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
      });
    // return this.availableExercises.slice();
  }

  startExercise(selectedId: string) {
    this.runningExercise =
      this.availableExercises.find((ex) => ex.id === selectedId) || null;
    if (this.runningExercise) {
      this.exerciseChanged.next({ ...this.runningExercise });
    }
  }

  completeExercise() {
    if (this.runningExercise) {
      this.addDataToDatabase({
        ...this.runningExercise,
        date: new Date(),
        state: 'completed',
      });
      this.runningExercise = null;
      this.exerciseChanged.next(null);
    }
  }

  cancelExercise(progress: number) {
    if (this.runningExercise) {
      this.addDataToDatabase({
        ...this.runningExercise,
        duration: this.runningExercise.duration * (progress / 100),
        calories: this.runningExercise.calories * (progress / 100),
        date: new Date(),
        state: 'cancelled',
      });
      this.runningExercise = null;
      this.exerciseChanged.next(null);
    }
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  getCompletedOrCancelledExercises() {
    return this.exercises.slice();
  }

  private addDataToDatabase(exercise: Exercise) {
    this.firestore.collection('finishedExercises').add(exercise);
    // this.exercises.push(exercise);
  }
}
