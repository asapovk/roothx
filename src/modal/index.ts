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

export const Window = (args: IWindowOpts) =>
  tree.root(
    {
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
        tree.tag(
          {
            tagName: 'div',
            attributes: {
              class: 'popupWindow',
            },
            child: tree.tag(
              {
                tagName: 'div',
                attributes: {
                  class: 'popup-window-content',
                },
                child: [
                  tree.tag(
                    {
                      tagName: 'div',
                      attributes: {},
                      child: args.text,
                    },
                    'modal_window_text'
                  ),
                  tree.tag(
                    {
                      tagName: 'div',
                      attributes: {
                        class: 'modal-buttons',
                      },
                      child: [
                        tree.tag(
                          {
                            tagName: 'button',
                            attributes: {
                              class: 'modal-buttons-button btn-yes',
                            },
                            eventListeners: {
                              click: () => args.onYes(),
                            },
                            child: 'Yes',
                          },
                          'modal_window_button_yes'
                        ),
                        tree.tag(
                          {
                            tagName: 'button',
                            attributes: {
                              class: 'modal-buttons-button btn-no',
                            },
                            eventListeners: {
                              click: () => args.onNo(),
                            },
                            child: 'No',
                          },
                          'modal_window_button_no'
                        ),
                        tree.tag(
                          {
                            tagName: 'button',
                            attributes: {
                              class: 'modal-buttons-button btn-no',
                            },
                            eventListeners: {
                              click: () => args.onCancel(),
                            },
                            child: 'Cancel',
                          },
                          'modal_window_button_cancel'
                        ),
                      ],
                    },
                    'modal_window_buttons'
                  ),
                ],
              },
              'modal_window_content'
            ),
          },
          'modal_window'
        ),
      ],
    },
    'popupBackground_root'
  );
