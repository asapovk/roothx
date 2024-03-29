import {
  ScriptUpdateArgsType,
  ScriptOptsType,
  ScriptInitArgsType,
} from '@reflexio/reflexio-on-redux/lib/types';
import { IState, ITriggers } from '../../_redux/types';
import {
  INotificationState,
  INotificationTriggers,
} from '../notification.config';

export class NotificationScrit {
  constructor(
    private opts: ScriptOptsType<
      INotificationTriggers,
      ITriggers,
      IState,
      'showNotification'
    >
  ) {}

  private timeout;

  public init(
    args: ScriptInitArgsType<INotificationTriggers, 'showNotification', 'init'>
  ) {
    console.log('NOTIFICATION INIT');
    this.timeout = setTimeout(() => {
      this.opts.trigger('showNotification', 'close', null);
    }, 2000);
  }

  public update(
    args: ScriptUpdateArgsType<
      INotificationTriggers,
      'showNotification',
      'close' | 'stopInitSequence' | 'startCloseSequence'
    >
  ) {
    if (args.status === 'close') {
      console.log('NOTIFICATION CLOSE');
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
    }
    // if (args.status === 'stopInitSequence') {

    // }
    // if (args.status === 'startCloseSequence') {

    // }
  }
}
