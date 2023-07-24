import './styles.less';
import { Tree, createPortal } from '../../../../../packages/core/lib/NTree';
import { Reflexio } from '../../root-redux/reflector';
import { IState } from '../../_redux/types';

const reflexio = new Reflexio<IState['app']>();
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
