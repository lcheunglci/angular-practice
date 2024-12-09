import { createActionGroup, emptyProps } from '@ngrx/store';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Set Authenticated': emptyProps(),
    'Set Unauthenticated': emptyProps(),
  },
});
