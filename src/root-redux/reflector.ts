/* eslint-disable @typescript-eslint/ban-ts-comment */
import store from '../_redux/index';
import { IState, ITriggers } from '../_redux/types';

import { DispatcherType } from '@reflexio/reflexio-on-redux/lib/types';
import { getActionType } from '@reflexio/reflexio-on-redux/lib/utils';

export class Reflexio<T> {
  private state: T;
  private selector: (st: IState) => T;
  private contextFunction: Function;

  private triggerAction = (action) => {
    //@ts-ignore
    store.dispatch(action);
    //@ts-ignore
    this.state = this.selector(store.getState());
  };

  private trigger: DispatcherType<ITriggers> = (trigger, status, payload) => {
    const combynedType = getActionType(trigger as string, status as any);
    this.triggerAction({ type: combynedType, payload });
  };

  private isMounted: boolean;
  public useReflexio(selector: (st: IState) => T, context: Function) {
    if (!this.isMounted) {
      this.selector = selector;
      this.isMounted = true;
      //@ts-ignore
      this.state = this.selector(store.getState());
      this.contextFunction = context;
      store.subscribe(() => context());
    }

    return {
      state: this.state,
      trigger: this.trigger,
    };
  }
}
