import { Action, State, StateContext } from '@ngxs/store';
import { Hide, Show } from '../actions/home.actions';

@State<boolean>({
  name: 'home',
  defaults: false,
})
export class HomeState {
  @Action(Show)
  show(ctx: StateContext<boolean>) {
    ctx.setState(true);
  }

  @Action(Hide)
  hide(ctx: StateContext<boolean>) {
    ctx.setState(false);
  }
}
