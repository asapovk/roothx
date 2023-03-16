/* eslint-disable @typescript-eslint/no-empty-function */
import { IState, ITriggers } from '../../../src/_redux/types';
import {
  ScriptInitArgsType,
  ScriptOptsType,
  ScriptUpdateArgsType,
} from '@reflexio/reflexio-on-redux/lib/types';
import { IPopupTriggers } from '../popup.config';

export class OpenPopupScript {
  constructor(
    private opts: ScriptOptsType<IPopupTriggers, ITriggers, IState, 'openPopup'>
  ) {}

  private yesCb: () => void;
  private noCb: () => void;
  private cancelCb: () => void;

  public init(args: ScriptInitArgsType<IPopupTriggers, 'openPopup', 'init'>) {
    console.log('POPUP INIIT');
    this.cancelCb = (ar) => args.cancelCb(ar);
    this.yesCb = (ar) => args.yesCb(ar);
    this.noCb = (ar) => args.noCb(ar);
    // here we can implement popup queue
  }

  public update(
    args: ScriptUpdateArgsType<
      IPopupTriggers,
      'openPopup',
      'close' | 'no' | 'yes' | 'cancel'
    >
  ) {
    console.log('poupupdate');
    if (args.status === 'yes') {
      this.yesCb();
    }
    if (args.status === 'no') {
      this.noCb();
    }
    if (args.status === 'cancel') {
      this.cancelCb();
    }
  }
}
