import './styles.less';
import { Tree, createPortal } from '../../../../../packages/core/lib/NTree';
import { Reflexio } from '../../../../../packages/on-reflexio/lib/reflector';
import { IState, ITriggers } from '../../_redux/types';
import {store, system} from '../../_redux/index';

const reflexio = new Reflexio<ITriggers, IState>(store, system);
const tree = new Tree({
  makeElement: (tag) => document.createElement(tag),
});
export const dialogPortal = createPortal();
export const Dialog = () => {
  const { state: appState, trigger } = reflexio.useReflexio(
    (st: IState) => st.app,
    ['dialog'],
    Dialog
  );

  console.log('dialog render');

  return tree.root({
    attributes: {
      class: 'dialog-background',
    },
    tagName: 'div',
    isMute: !appState.dialog?.isOpen,
    child: [
      tree.tag({
        tagName: 'div',
        attributes: {
          class: 'dialog-layer',
        },
        eventListeners: {
          click: () => trigger('dialog', 'clickBackgroud', null),
        },
        child: '',
      }),
      tree.tag({
        tagName: 'div',
        attributes: {
          class: 'dialog-window',
        },
        child: dialogPortal.fromPortal(),
      }),
    ],
  });
};
