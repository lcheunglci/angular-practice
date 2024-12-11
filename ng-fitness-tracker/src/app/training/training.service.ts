import { Injectable } from '@angular/core';
import { Exercise } from './exercise.model';
import { map, Observable, Subscription, take } from 'rxjs';
import { UIActions } from '../shared/ui.actions';
import { TrainingActions } from './training.actions';
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
  fbSubs: Subscription[] = [];

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
            this.store.dispatch(UIActions.stopLoading());
            this.store.dispatch(
              TrainingActions.setAvailableTrainings({
                availableExercises: exercises,
              })
            );
          },
          error: () => {
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackbar(
              'Fetching Exercises failed, please try again later',
              '',
              3000
            );
          },
        })
    );
  }

  startExercise(selectedId: string) {
    this.store.dispatch(TrainingActions.startTraining({ id: selectedId }));
  }

  completeExercise() {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((ex) => {
        if (ex) {
          this.addDataToDatabase({
            ...ex,
            date: new Date(),
            state: 'completed',
          });
          this.store.dispatch(TrainingActions.stopTraining());
        }
      });
  }

  cancelExercise(progress: number) {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((ex) => {
        if (ex) {
          this.addDataToDatabase({
            ...ex,
            duration: ex.duration * (progress / 100),
            calories: ex.calories * (progress / 100),
            date: new Date(),
            state: 'cancelled',
          });
        }
      });
    this.store.dispatch(TrainingActions.stopTraining());
  }

  fetchCompletedOrCancelledExercises() {
    const finishedExerciseCollection = collection(this.db, 'finishedExercises');
    const data$ = collectionData(finishedExerciseCollection) as Observable<
      Exercise[]
    >;

    this.fbSubs.push(
      data$.subscribe({
        next: (exercises: Exercise[]) => {
          this.store.dispatch(
            TrainingActions.setFinishedTrainings({
              finishedExercises: exercises,
            })
          );
        },
      })
    );
  }

  cancelSubscriptions() {
    this.fbSubs.forEach((sub) => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise) {
    const finishedExerciseCollection = collection(this.db, 'finishedExercises');
    addDoc(finishedExerciseCollection, exercise);
  }
}
