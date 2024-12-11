import { Exercise } from './exercise.model';
import { TrainingActions } from './training.actions';
import * as fromRoot from '../app.reducer';
import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';

export interface TrainingState {
  availableExercises: Exercise[];
  finishedExercises: Exercise[];
  activeTraining: Exercise | null;
}

export interface State extends fromRoot.State {
  training: TrainingState;
}

const initialState: TrainingState = {
  availableExercises: [],
  finishedExercises: [],
  activeTraining: null,
};

export const trainingReducer = createReducer(
  initialState,
  on(TrainingActions.setAvailableTrainings, (state, action) => ({
    ...state,
    availableExercises: action.availableExercises,
  })),
  on(TrainingActions.setFinishedTrainings, (state, action) => ({
    ...state,
    finishedExercises: action.finishedExercises,
  })),
  on(TrainingActions.startTraining, (state, action) => ({
    ...state,
    activeTraining: {
      ...state.availableExercises.find((ex) => ex.id === action.id)!,
    },
  })),
  on(TrainingActions.stopTraining, (state) => ({
    ...state,
    activeTraining: null,
  }))
);

// export function trainingReducer(
//   state = initialState,
//   action: TrainingActions
// ): TrainingState {
//   switch (action.type) {
//     case SET_AVAILABLE_TRAININGS:
//       return { ...state, availableExercises: action.payload };
//     case SET_FINISHED_TRAININGS:
//       return { ...state, finishedExercises: action.payload };
//     case START_TRAINING:
//       return {
//         ...state,
//         activeTraining: {
//           ...state.availableExercises.find((ex) => ex.id === action.payload)!,
//         },
//       };
//     case STOP_TRAINING:
//       return { ...state, activeTraining: null };
//     default:
//       return state;
//   }
// }

export const getTrainingState =
  createFeatureSelector<TrainingState>('training');

export const getAvailableExercises = createSelector(
  getTrainingState,
  (state: TrainingState) => state.availableExercises
);
export const getFinishedExercises = createSelector(
  getTrainingState,
  (state: TrainingState) => state.finishedExercises
);
export const getActiveTraining = createSelector(
  getTrainingState,
  (state: TrainingState) => state.activeTraining
);

export const getIsTraining = createSelector(
  getTrainingState,
  (state: TrainingState) => state.activeTraining !== null
);
