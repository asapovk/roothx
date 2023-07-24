/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-empty-function */
import { IState, ITriggers } from '../../_redux/types';
import {
  ScriptInitArgsType,
  ScriptOptsType,
  ScriptUpdateArgsType,
} from '@reflexio/reflexio-on-redux/lib/types';
import { IAppTrigges } from '../app.config';

export class DialogScript {
  constructor(
    private opts: ScriptOptsType<IAppTrigges, ITriggers, IState, 'dialog'>
  ) {}
  private clickBackgroundHandler: () => void;

  public init(payload: ScriptInitArgsType<IAppTrigges, 'dialog', 'init'>) {
    // here we can implement popup queue
    //@ts-ignore
    const cb = payload;
    console.log('init');

    this.clickBackgroundHandler = cb;
  }

  public update(
    args: ScriptUpdateArgsType<IAppTrigges, 'dialog', 'clickBackgroud'>
  ) {
    if (args.status === 'clickBackgroud') {
      console.log('BACKGROUND');
      if (this.clickBackgroundHandler) {
        this.clickBackgroundHandler();
      }
    }
  }
}
