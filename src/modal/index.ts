import { Tree, Root } from '../root/NTree';
import './styles.less';

const tree = new Tree({
  makeElement: (tag) => document.createElement(tag),
});

export const Window = (show: boolean, onClick: () => void) => {
  console.log('window render');
  console.log(show);
  // if (!show) {
  //   return null;
  // }

  return tree.root({
    key: 'modal_root',
    attributes: {
      class: 'popupBackground',
      style: !show ? 'display: none;' : undefined,
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
        child: tree.tag({
          key: 'modal_window_content',
          tagName: 'div',
          attributes: {
            class: 'popup-window-content',
          },
          child: [
            tree.tag({
              tagName: 'div',
              key: 'modal_window_text',
              attributes: {},
              child: 'text',
            }),
            tree.tag({
              tagName: 'div',
              key: 'modal_window_buttons',
              attributes: {
                class: 'modal-buttons',
              },
              child: [
                tree.tag({
                  tagName: 'button',
                  key: 'modal_window_button_yes',
                  attributes: {
                    class: 'modal-buttons-button btn-yes',
                  },
                  child: 'Yes',
                }),
                tree.tag({
                  tagName: 'button',
                  key: 'modal_window_button_no',
                  attributes: {
                    class: 'modal-buttons-button btn-no',
                  },
                  child: 'No',
                }),
                tree.tag({
                  tagName: 'button',
                  key: 'modal_window_button_cancel',
                  attributes: {
                    class: 'modal-buttons-button btn-no',
                  },
                  child: 'Cancel',
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
};
