import { IState, ITriggers } from '../../src/_redux/types';
import { Bite, Slice } from '@reflexio/reflexio-on-redux/lib';
import { TriggerPhaseWrapper } from '@reflexio/reflexio-on-redux/lib/types';
import { INotification } from './interfaces/Notification.interface';
import { NotificationScrit } from './scripts/Notification.script';

export interface INotificationState {
  notifications: Array<INotification>;
}

export interface INotificationTriggers {
  showNotification: TriggerPhaseWrapper<{
    init: {
      message: string;
      afterCloseAction?: {
        type: string;
        payload?: any;
      };
      awaitClose?: boolean;
      blocksQueue?: boolean;
      showTime?: number;
      type?: 'white' | 'primary' | 'warning' | 'success' | 'error';
    };
    startCloseSequence: null;
    stopInitSequence: null;
    close: null;
  }>;
}

export const notificationInitialState: INotificationState = {
  notifications: [],
};

export const showNotificationBite = Bite<
  INotificationTriggers,
  ITriggers,
  INotificationState,
  IState,
  'showNotification'
>(
  {
    init: (state, payload) => {
      state.notifications = [
        { content: payload.message, type: payload.type || 'primary' },
      ];
    },
    startCloseSequence: null,
    stopInitSequence: null,
    close: (state, payload) => {
      state.notifications = [];
    },
  },
  {
    script: NotificationScrit,
    instance: 'stable',
    triggerStatus: 'init',
    updateOn: ['showNotification'],
    canTrigger: ['showNotification'],
  }
);

export const notificationSlice = Slice<
  INotificationTriggers,
  ITriggers,
  INotificationState,
  IState
>(
  'notification',
  {
    showNotification: showNotificationBite,
  },
  notificationInitialState
);
