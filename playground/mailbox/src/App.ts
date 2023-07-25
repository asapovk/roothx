/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Tree, Root } from '../../../packages/core/lib/NTree';
import { Sidebar } from './folders/components';
import { LettersList } from './letters/components/LettersList';
import { Notification } from './notification/components/Notification';
import { Popup } from './popup/components/Window';
import { MainMenu } from './main-menu/components';
import { Dialog } from './app/components/Dialog';
import { IState } from './_redux/types';
import { Reflexio } from '../../../packages/on-reflexio/lib/reflector';
import store from './_redux/index';

const reflexio = new Reflexio<IState['app']>(store);
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
    [], //OPTIMIZE!!!
    //['appController'],
    Application
  );

  return tree.root(
    {
      onMount() {
        trigger('appController', 'init', null);
      },
      onUpdate() {
        console.log('root update');
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
