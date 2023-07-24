/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-empty-function */
import { IState, ITriggers } from '../../_redux/types';
import {
  ScriptInitArgsType,
  ScriptOptsType,
  ScriptUpdateArgsType,
} from '@reflexio/reflexio-on-redux/lib/types';
import { IAppTrigges } from '../app.config';

export class AppControllerScript {
  constructor(
    private opts: ScriptOptsType<
      IAppTrigges,
      ITriggers,
      IState,
      'appController'
    >
  ) {}
  private width: number;
  private isInit: boolean = false;
  private mode: '3k' | '2k' | '1k';

  private handleSize() {
    const width = window.innerWidth;
    this.width = width;
    if (width < 1400 && width > 1200) {
      if (this.mode !== '2k') {
        this.mode = '2k';
        this.opts.trigger('appController', 'setSizeMode', '2col');
      }
    } else if (width < 1200) {
      if (this.mode !== '1k') {
        this.mode = '1k';
        this.opts.trigger('appController', 'setSizeMode', '1col');
      }
    } else if (width > 1400) {
      if (this.mode !== '3k') {
        this.mode = '3k';
        this.opts.trigger('appController', 'setSizeMode', '3col');
      }
    }
  }

  public init(payload: ScriptInitArgsType<IAppTrigges, 'dialog', 'init'>) {
    if (!this.isInit) {
      this.handleSize();
      addEventListener('resize', (e) => {
        this.handleSize();
      });
      this.isInit = true;
    }
  }

  public update(
    args: ScriptUpdateArgsType<IAppTrigges, 'appController', 'setSizeMode'>
  ) {}
}
