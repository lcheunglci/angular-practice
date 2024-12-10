import { createActionGroup, emptyProps } from '@ngrx/store';

export const UIActions = createActionGroup({
  source: 'UI',
  events: {
    'Start Loading': emptyProps(),
    'Stop Loading': emptyProps(),
  },
});
