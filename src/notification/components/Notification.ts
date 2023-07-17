import { IState } from '../../_redux/types';
//import { useTrigger } from 'src/_redux/useTrigger';
import './style.less';
import { Reflexio } from '../../root-redux/reflector';
import { Tree } from '../../root/NTree';

const reflexio = new Reflexio<IState['notification']['notifications']>();
const tree = new Tree({
  makeElement: (tag) => document.createElement(tag),
});
export const Notification = () => {
  const { state, trigger } = reflexio.useReflexio(
    (state: IState) => state.notification.notifications,
    Notification
  );

  return tree.root(
    {
      attributes: {
        class: 'notification',
        //style: !state[0] ? 'display: none;' : undefined,
      },
      isMute: !state[0],
      eventListeners: {
        click: () => trigger('showNotification', 'close', null),
      },
      child: state[0] ? state[0].content : 'nope',
      tagName: 'div',
    },
    'notification_root_key'
  );
};
