import { Tree, Root } from './root/NTree';
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
      child: [Notification(), LettersList(), Popup()],
    },
    'app_root'
  );
