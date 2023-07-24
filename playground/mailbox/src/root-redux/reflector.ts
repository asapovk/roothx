/* eslint-disable @typescript-eslint/ban-ts-comment */
//import store from '../_redux/index';
import { IState, ITriggers } from '../_redux/types';

import { DispatcherType } from '@reflexio/reflexio-on-redux/lib/types';
import { getActionType } from '@reflexio/reflexio-on-redux/lib/utils';
import { LoadStore } from './loadStore';
import { useSystem } from '@reflexio/reflexio-on-redux';
import { matchActionType } from '../root-redux/utils';
//const store = import(/* webpackChunkName: script */ '../_redux/index');

export class Reflexio<T> {
  private state: T;
  private store;
  private selector: (st: IState) => T;
  private contextFunction: Function;
  private subscribtion: () => void;

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
  public useReflexio(
    selector: (st: IState) => T,
    conditon: Array<any>,
    context?: Function
  ) {
    if (!this.isMounted) {
      const system = useSystem();
      this.store = LoadStore.getStore().loadedStore;
      if (this.store) {
        this.selector = selector;
        //@ts-ignore
        this.state = this.selector(this.store.getState());
        this.isMounted = true;
        //@ts-ignore
        if (context) {
          this.contextFunction = context;
          this.subscribtion = this.store.subscribe(() => {
            const task = system.taksQueue.getCurrentTask();
            if (
              conditon.length ||
              (task && matchActionType(task.type, conditon))
            )
              this.contextFunction();
          });
        }
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
      subscribtion: this.subscribtion,
    };
  }
}
