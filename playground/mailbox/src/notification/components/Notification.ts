import { IState } from '../../_redux/types';
//import { useTrigger } from 'src/_redux/useTrigger';
import './style.less';
import { Reflexio } from '../../../../../packages/on-reflexio/lib/reflector';
import { Tree } from '../../../../../packages/core/lib/NTree';
import cn from 'classnames';
import store from '../../_redux/index';

const reflexio = new Reflexio<IState['notification']['notifications']>(store);
const tree = new Tree({
  makeElement: (tag) => document.createElement(tag),
});
export const Notification = () => {
  const { state, trigger } = reflexio.useReflexio(
    (state: IState) => state.notification.notifications,
    ['showNotification'],
    Notification
  );

  const notification = state[0];

  return tree.root(
    {
      isMute: !notification,
      attributes: notification
        ? {
            class: cn('notify', {
              notifyPrimary: notification.type === 'primary',
              notifySuccess: notification.type === 'success',
              notifyError: notification.type === 'error',
              notifyWarning: notification.type === 'warning',
              notifyWhite: notification.type === 'white',
            }),
            //style: !state[0] ? 'display: none;' : undefined,
          }
        : undefined, //Need upgrade in core
      eventListeners: {
        click: () => trigger('showNotification', 'close', null),
      },
      child: state[0] ? state[0].content : 'nope',
      tagName: 'div',
    },
    'notification_root_key'
  );
};
