import { reducers } from './../app.reducer';
import { Injectable } from '@angular/core';
import { Exercise } from './exercise.model';
import { map, Observable, Subject, Subscription } from 'rxjs';
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';
import * as fromTraining from './training.reducer';

import {
  collection,
  collectionData,
  Firestore,
  collectionSnapshots,
  addDoc,
} from '@angular/fire/firestore';
import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  exerciseChanged = new Subject<Exercise | null>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];
  fbSubs: Subscription[] = [];

  private runningExercise: Exercise | null = null;

  constructor(
    private db: Firestore,
    private uiService: UIService,
    private store: Store<fromTraining.State>
  ) {}

  fetchAvailableExercises() {
    const exerciseCollection = collection(this.db, 'availableExercises');
    this.fbSubs.push(
      collectionSnapshots(exerciseCollection)
        .pipe(
          map((docArray) => {
            const exerciseList: Exercise[] = docArray.map((doc) => {
              return {
                id: doc.id,
                name: doc.data()['name'] as string,
                duration: doc.data()['duration'] as number,
                calories: doc.data()['calories'] as number,
              } as Exercise;
            });
            return exerciseList;
          })
        )
        .subscribe({
          next: (exercises: Exercise[]) => {
            this.store.dispatch(new UI.StopLoading());
            this.store.dispatch(new Training.SetAvailableTrainings(exercises));
            // this.availableExercises = exercises;
            // this.exercisesChanged.next([...this.availableExercises]);
          },
          error: () => {
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackbar(
              'Fetching Exercises failed, please try again later',
              '',
              3000
            );
            this.exerciseChanged.next(null);
          },
        })
    );

    // return this.availableExercises.slice();
  }

  startExercise(selectedId: string) {
    // this.runningExercise =
    //   this.availableExercises.find((ex) => ex.id === selectedId) || null;
    // if (this.runningExercise) {
    //   this.exerciseChanged.next({ ...this.runningExercise });
    // }
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise() {
    if (this.runningExercise) {
      this.addDataToDatabase({
        ...this.runningExercise,
        date: new Date(),
        state: 'completed',
      });
      // this.runningExercise = null;
      // this.exerciseChanged.next(null);
      this.store.dispatch(new Training.StopTraining());
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
      // this.runningExercise = null;
      // this.exerciseChanged.next(null);
      this.store.dispatch(new Training.StopTraining());
    }
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  fetchCompletedOrCancelledExercises() {
    const finishedExerciseCollection = collection(this.db, 'finishedExercises');
    const data$ = collectionData(finishedExerciseCollection) as Observable<
      Exercise[]
    >;

    this.fbSubs.push(
      data$.subscribe({
        next: (exercises: Exercise[]) => {
          //console.log('fetchCompletedOrCancelled', exercises);
          // this.finishedExercisesChanged.next(exercises);
          this.store.dispatch(new Training.SetFinishedTrainings(exercises));
        },
      })
    );
    //return this.finishedExercises.slice();
  }

  cancelSubscriptions() {
    this.fbSubs.forEach((sub) => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise) {
    const finishedExerciseCollection = collection(this.db, 'finishedExercises');
    addDoc(finishedExerciseCollection, exercise);
    // this.exercises.push(exercise);
  }
}
