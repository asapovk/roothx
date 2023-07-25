/* eslint-disable @typescript-eslint/ban-ts-comment */
//import store from '../_redux/index';
import { IState, ITriggers } from '../../../playground/mailbox/src/_redux/types';

import { DispatcherType } from '@reflexio/reflexio-on-redux/lib/types';
import { getActionType } from '@reflexio/reflexio-on-redux/lib/utils';
//import { LoadStore } from '../../../playground/mailbox/src/_redux/loadStore';
import { useSystem } from '@reflexio/reflexio-on-redux';
import { matchActionType } from './utils';
//const store = import(/* webpackChunkName: script */ '../_redux/index');

export class Reflexio<T> {
  private state: T;
  private store;
  private selector: (st: IState) => T;
  private contextFunction: Function;
  private subscribtion: () => void;


  constructor(store: any) {
    this.store = store;
  }

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
  
      //this.store = LoadStore.getStore().loadedStore;
      if (this.store) {
        this.selector = selector;
        //@ts-ignore
        this.state = this.selector(this.store.getState());
        this.isMounted = true;
        //@ts-ignore
        if (context) {
          this.contextFunction = context;
          this.subscribtion = this.store.subscribe(() => {
            const system = useSystem();
            console.log(system);
            const task = system.taksQueue.getCurrentTask();
            console.log(task);
            if (
              !conditon.length ||
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
