import { Tree, Root } from '../root/NTree';
import './styles.less';

const tree = new Tree({
  makeElement: (tag) => document.createElement(tag),
});

export const Application = () => {
  tree.root({
    key: 'root',
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
            child: 'Submit',
          }),
        ],
      }),
    ],
  });

  return tree.calc();
};
