import { Window } from '../modal';
import { Tree, Root } from '../../../../packages/core/lib/NTree';
import { State } from '../../../../packages/core/lib/State';
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

  return tree.root(
    {
      attributes: {
        id: 'root',
      },
      tagName: 'div',
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
              tree.tag(
                {
                  tagName: 'button',
                  attributes: {
                    class: 'form-button',
                  },
                  eventListeners: {
                    click: (e) => setModalOpen(true),
                  },
                  child: 'Submit',
                },
                'pasword-button'
              ),
            ],
          },
          'container'
        ),
        //Window(modalOpen, () => setModalOpen(false)),
      ],
    },
    'root'
  );
};
