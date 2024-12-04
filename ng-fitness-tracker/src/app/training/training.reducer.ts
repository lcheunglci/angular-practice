import { Exercise } from './exercise.model';
import {
  SET_AVAILABLE_TRAININGS,
  SET_FINISHED_TRAININGS,
  STOP_TRAINING,
  START_TRAINING,
  TrainingActions,
} from './training.actions';
import * as fromRoot from '../app.reducer';

export interface TrainingState {
  availableExercises: Exercise[];
  finishedExercises: Exercise[];
  activeTraining: null;
}

export interface State extends fromRoot.State {
  training: TrainingState;
}

const initialState: TrainingState = {
  availableExercises: [],
  finishedExercises: [],
  activeTraining: null,
};

export function authReducer(
  state = initialState,
  action: TrainingActions
): State {
  switch (action.type) {
    case SET_AVAILABLE_TRAININGS:
      return { ...state, availableExercise: action.payload };
    case SET_FINISHED_TRAININGS:
      return { ...state, finishedExercise: action.payload };
    case START_TRAINING:
      return { ...state, activeTraining: action.payload };
    case STOP_TRAINING:
      return { ...state, activeTraining: null };
    default:
      return state;
  }
}

// export const getIsAuth = (state: State) => state.isAuthenticated;
