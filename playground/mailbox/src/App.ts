import { Tree, Root } from '../../../packages/core/lib/NTree';
import { Sidebar } from './folders/components';
import { LettersList } from './letters/components/LettersList';
import { Notification } from './notification/components/Notification';
import { Popup } from './popup/components/Window';

const tree = new Tree({
  makeElement: (tag) => document.createElement(tag),
});

export const Application = () =>
  tree.root(
    {
      tagName: 'div',
      attributes: {
        id: 'app_root',
      },
      child: [Sidebar(), Notification(), LettersList(), Popup()],
    },
    'app_root'
  );
