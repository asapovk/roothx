import { Tree, Root } from '../../../../../../packages/core/lib//NTree';
import { State } from '../../../../../../packages/core/lib/State';
import { Button } from '../../../../../../packages/button/src/index';
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

  return tree.root(
    {
      tagName: 'div',
      attributes: {
        id: 'root',
      },
      child: [
        tree.tag(
          {
            tagName: 'div',
            attributes: {
              class: 'form-container',
            },
            child: [
              tree.tag(
                {
                  tagName: 'input',
                  attributes: {
                    class: 'form-input',
                  },
                  child: '',
                },
                'email-input'
              ),
              tree.tag(
                {
                  tagName: 'input',
                  attributes: {
                    class: 'form-input',
                  },
                  child: '',
                },
                'pasword-input'
              ),

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
          },
          'container'
        ),
      ],
    },
    'root'
  );
};
