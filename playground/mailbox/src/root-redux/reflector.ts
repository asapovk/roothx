/* eslint-disable @typescript-eslint/ban-ts-comment */
//import store from '../_redux/index';
import { IState, ITriggers } from '../_redux/types';

import { DispatcherType } from '@reflexio/reflexio-on-redux/lib/types';
import { getActionType } from '@reflexio/reflexio-on-redux/lib/utils';
import { LoadStore } from './loadStore';

//const store = import(/* webpackChunkName: script */ '../_redux/index');

export class Reflexio<T> {
  private state: T;
  private store;
  private selector: (st: IState) => T;
  private contextFunction: Function;

  private triggerAction = (action) => {
    //@ts-ignore
    this.store.dispatch(action);
    //@ts-ignore
  };

  private trigger: DispatcherType<ITriggers> = (trigger, status, payload) => {
    const combynedType = getActionType(trigger as string, status as any);
    this.triggerAction({ type: combynedType, payload });
  };

  private isMounted: boolean;
  public useReflexio(selector: (st: IState) => T, context: Function) {
    if (!this.isMounted) {
      this.store = LoadStore.getStore().loadedStore;
      if (this.store) {
        this.selector = selector;
        //@ts-ignore
        this.state = this.selector(this.store.getState());
        this.isMounted = true;
        //@ts-ignore
        this.contextFunction = context;
        this.store.subscribe(() => context());
      }
    } else {
      //@ts-ignore
      if (this.store) {
        this.state = this.selector(this.store.getState());
      }
    }

    return {
      state: this.state,
      trigger: this.trigger,
    };
  }
}
