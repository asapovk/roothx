//import * as React from 'react';
//import { shallowEqual, useSelector } from 'react-redux';
import { IState } from '../../../src/_redux/types';
import { IPopupState } from '../popup.config';
import { Window } from '../../modal/index';
import { Reflexio } from '../../root-redux/reflector';
import { Tree } from '../../root/NTree';

const reflexio = new Reflexio<IState['popup']>();
const tree = new Tree({
  makeElement: (tag) => document.createElement(tag),
});
export const Popup = () => {
  const { state, trigger } = reflexio.useReflexio(
    (state: IState) => state.popup,
    Popup
  );

  return Window(state.isOpen, () => trigger('openPopup', 'close', null));
};
