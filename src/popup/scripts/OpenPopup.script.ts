/* eslint-disable @typescript-eslint/no-empty-function */
import { IState, ITriggers } from 'src/_redux/types';
import {
  ScriptInitArgsType,
  ScriptOptsType,
  ScriptUpdateArgsType,
} from '../../../../../packages/reflexio-on-redux/dist/lib/types';
import { IPopupTriggers } from '../popup.config';

export class OpenPopupScript {
  constructor(
    private opts: ScriptOptsType<IPopupTriggers, ITriggers, IState, 'openPopup'>
  ) {}

  private yesCb: () => void;
  private noCb: () => void;
  private cancelCb: () => void;

  public init(args: ScriptInitArgsType<IPopupTriggers, 'openPopup', 'init'>) {
    console.log(this.opts.getCurrentState().popup);
    this.cancelCb = args.payload.cancelCb;
    this.yesCb = args.payload.yesCb;
    this.noCb = args.payload.noCb;
    // here we can implement popup queue
  }

  public update(
    args: ScriptUpdateArgsType<IPopupTriggers, 'openPopup', 'close'>
  ) {
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
