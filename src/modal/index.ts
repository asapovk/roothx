import { Tree, Root } from '../root/NTree';
import './styles.less';

const tree = new Tree({
  makeElement: (tag) => document.createElement(tag),
});

export const Window = (show: boolean, onClick: () => void) => {
  if (!show) {
    return null;
  }

  return tree.root({
    key: 'modal_root',
    attributes: {
      class: 'popupBackground',
    },
    child: [
      tree.tag({
        tagName: 'div',
        key: 'modal_layer',
        attributes: {
          class: 'popupLayer',
        },
        eventListeners: {
          click: (e) => onClick(),
        },
        child: '',
      }),
      tree.tag({
        tagName: 'div',
        key: 'modal_window',
        attributes: {
          class: 'popupWindow',
        },
        child: 'modal window',
      }),
    ],
  });
};
