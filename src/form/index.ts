import { Window } from '../modal';
import { Tree, Root } from '../root/NTree';
import { State } from '../root/State';
import './styles.less';

const tree = new Tree({
  makeElement: (tag) => document.createElement(tag),
});

const modalState = new State<boolean>();
export const Application = () => {
  const { state: modalOpen, setState: setModalOpen } = modalState.useState(
    false,
    Application
  );

  return tree.root({
    key: 'root',
    attributes: {
      id: 'root',
    },
    child: [
      tree.tag({
        key: 'container',
        tagName: 'div',
        attributes: {
          class: 'form-container',
        },
        child: [
          tree.tag({
            tagName: 'input',
            key: 'email-input',
            attributes: {
              class: 'form-input',
            },
            child: '',
          }),
          tree.tag({
            tagName: 'input',
            key: 'pasword-input',
            attributes: {
              class: 'form-input',
            },
            child: '',
          }),
          tree.tag({
            tagName: 'button',
            key: 'pasword-button',
            attributes: {
              class: 'form-button',
            },
            eventListeners: {
              click: (e) => setModalOpen(true),
            },
            child: 'Submit',
          }),
        ],
      }),
      Window(modalOpen, () => setModalOpen(false)),
    ],
  });
};
