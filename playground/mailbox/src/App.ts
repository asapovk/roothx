/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Tree, Root } from '../../../packages/core/lib/NTree';
import { Sidebar } from './folders/components';
import { LettersList } from './letters/components/LettersList';
import { Notification } from './notification/components/Notification';
import { Popup } from './popup/components/Window';
import { MainMenu } from './main-menu/components';
import { Dialog } from './app/components/Dialog';

const tree = new Tree({
  //@ts-ignore
  makeElement: (tag) => {
    if (tag === 'svg' || tag === 'path') {
      return document.createElementNS('http://www.w3.org/2000/svg', tag);
    } else {
      return document.createElement(tag);
    }
  },
});

export const Application = () =>
  tree.root(
    {
      tagName: 'div',
      attributes: {
        id: 'app_root',
      },
      child: [
        Sidebar(),
        Notification(),
        LettersList(),
        Popup(),
        MainMenu(),
        Dialog(),
      ],
    },
    'app_root'
  );
