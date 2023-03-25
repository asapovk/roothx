import { Tree, Root } from '../../../../../../src/root/NTree';
import { State } from '../../../../../../src/root/State';
import { Button } from '../../../../../button/src/index';
import './styles.less';

const tree = new Tree({
  makeElement: (tag) => document.createElement(tag),
});

const modalState = new State<boolean>();
export const AuthForm = () => {
  const { state: modalOpen, setState: setModalOpen } = modalState.useState(
    false,
    AuthForm
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

          Button('pasword-button', tree, {
            child: 'Submit' as any,
            onClick: () => setModalOpen(true),
          }),

          // tree.tag({
          //   tagName: 'button',
          //   key: 'pasword-button',
          //   attributes: {
          //     class: 'form-button',
          //   },
          //   eventListeners: {
          //     click: (e) => setModalOpen(true),
          //   },
          //   child: 'Submit',
          // }),
        ],
      }),
    ],
  });
};
