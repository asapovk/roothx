/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Tree, Root } from '../../../packages/core/lib/NTree';
import { Sidebar } from './folders/components';
import { LettersList } from './letters/components/LettersList';
import { Notification } from './notification/components/Notification';
import { Popup } from './popup/components/Window';
import { MainMenu } from './main-menu/components';
import { Dialog } from './app/components/Dialog';
import { IState } from './_redux/types';
import { Reflexio } from './root-redux/reflector';

const reflexio = new Reflexio<IState['app']>();
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

export const Application = () => {
  const { state, trigger } = reflexio.useReflexio(
    (state: IState) => state.app,
    ['appController'],
    Application
  );

  return tree.root(
    {
      onMount() {
        trigger('appController', 'init', null);
      },
      tagName: 'div',
      attributes: {
        id: 'app_root',
      },
      child: [
        Sidebar(),
        Notification(),
        LettersList(),
        MainMenu(),
        Popup(),
        Dialog(),
      ],
    },
    'app_root'
  );
};
