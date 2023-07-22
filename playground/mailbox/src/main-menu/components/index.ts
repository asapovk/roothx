import { Tree } from '../../../../../packages/core/lib/NTree';
import { Tags } from '../../../../../packages/core/lib/Tags';
import { IState } from '../../_redux/types';
import { Reflexio } from '../../root-redux/reflector';

//const vertialMenuItems  =  ['profile', 'contacts', 'setting' ]

const tree = new Tree({
  makeElement: (tag: string) => document.createElement(tag),
});
const tags = new Tags(tree);
const reflexio = new Reflexio();
export const MainMenu = () => {
  const { state, trigger } = reflexio.useReflexio(
    (state: IState) => state,
    MainMenu
  );

  return tags.root({
    tagName: 'div',
    attributes: {
      class: 'main-menu-container',
    },
    child: [
      tags.div({
        className: 'vertical-menu',
        child: null,
      }),
    ],
  });
};
