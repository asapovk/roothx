import { Tree, Root } from '../../../../packages/core/lib/NTree';
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

export const Window = (args: IWindowOpts) =>
  tree.root({
    attributes: {
      class: 'popupBackground',
    },
    tagName: 'div',
    isMute: !args.show,
    child: [
      tree.tag(
        {
          tagName: 'div',
          attributes: {
            class: 'popupLayer',
          },
          eventListeners: args.onBackground
            ? {
                click: () => args.onBackground(),
              }
            : undefined,
          child: '',
        },
        'modal_root'
      ),
      tree.tag({
        tagName: 'div',
        attributes: {
          class: 'popupWindow',
        },
        child: tree.tag({
          tagName: 'div',
          attributes: {
            class: 'popup-window-content',
          },
          child: [
            tree.tag({
              tagName: 'div',
              attributes: {},
              child: args.text,
            }),
            tree.tag({
              tagName: 'div',
              attributes: {
                class: 'modal-buttons',
              },
              child: [
                tree.tag({
                  tagName: 'button',
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
