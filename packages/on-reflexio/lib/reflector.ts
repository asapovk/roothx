/* eslint-disable @typescript-eslint/ban-ts-comment */
import { DispatcherType } from '@reflexio/reflexio-on-redux/lib/types';
import { getActionType } from '@reflexio/reflexio-on-redux/lib/utils';
import { matchActionType } from './utils';
import {UpdateOnType} from '@reflexio/reflexio-on-redux/lib/types'

export class Reflexio<Triggers, State> {
  private state;
  private store;
  private system;
  private selector;
  private contextFunction: Function;
  private subscribtion: () => void;


  constructor(store: any, system: any) {
    this.store = store;
    this.system = system;
  }

  private triggerAction = (action) => {
    this.store.dispatch(action);
  };

  private trigger: DispatcherType<Triggers> = (trigger, status, payload) => {
    const combynedType = getActionType(trigger as string, status as any);
    this.triggerAction({ type: combynedType, payload });
  };

  private isMounted: boolean;
  public useReflexio<T>(
    selector: (st: State) => T,
    conditon: UpdateOnType<Triggers>,
    context?: ()=> void,
  ): {
    state: T,
    trigger: DispatcherType<Triggers>,
    subscribtion: () => void,
  } {
    if (!this.isMounted) {
      if (this.store) {
        this.selector = selector;
        this.state = this.selector(this.store.getState());
        this.isMounted = true;
        const system = this.system;
        if (context) {
          this.contextFunction = context;
          this.subscribtion = this.store.subscribe(() => {
            const task = system.taksQueue.getCurrentTask();
            if (
              !conditon.length ||
              (task && matchActionType(task.type, conditon))
            )
              this.contextFunction();
          });
        }
      }
    } else {
      if (this.store) {
        this.state = this.selector(this.store.getState());
      }
    }

    return {
      state: this.state,
      trigger: this.trigger,
      subscribtion: () => {
        this.isMounted = false;
        this.subscribtion();
      }
    };
  }
}
