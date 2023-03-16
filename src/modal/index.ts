import { Tree, Root } from '../root/NTree';
import './styles.less';

const tree = new Tree({
  makeElement: (tag) => document.createElement(tag),
});

interface IWindowOpts {
  show: boolean;
  text: string;
  onYes: () => void;
  onNo: () => void;
  onCancel: () => void;
  onBackground: () => void;
}

export const Window = (args: IWindowOpts) => {
  console.log('window render');
  console.log(args.show);
  // if (!show) {
  //   return null;
  // }

  return tree.root({
    key: 'modal_root',
    attributes: {
      class: 'popupBackground',
      style: !args.show ? 'display: none;' : undefined,
    },
    child: [
      tree.tag({
        tagName: 'div',
        key: 'modal_layer',
        attributes: {
          class: 'popupLayer',
        },
        eventListeners: args.onBackground
          ? {
              click: () => args.onBackground(),
            }
          : undefined,
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
              child: args.text,
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
                  eventListeners: {
                    click: () => args.onYes(),
                  },
                  child: 'Yes',
                }),
                tree.tag({
                  tagName: 'button',
                  key: 'modal_window_button_no',
                  attributes: {
                    class: 'modal-buttons-button btn-no',
                  },
                  eventListeners: {
                    click: () => args.onNo(),
                  },
                  child: 'No',
                }),
                tree.tag({
                  tagName: 'button',
                  key: 'modal_window_button_cancel',
                  attributes: {
                    class: 'modal-buttons-button btn-no',
                  },
                  eventListeners: {
                    click: () => args.onCancel(),
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
