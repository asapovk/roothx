//import * as React from 'react';
//import { shallowEqual, useSelector } from 'react-redux';
import { IState } from '../../_redux/types';
import { IPopupState } from '../popup.config';
import { Window } from '../../modal/index';
import { Reflexio } from '../../root-redux/reflector';
import { Tree } from '../../../../../packages/core/lib/NTree';

const reflexio = new Reflexio<IState['popup']>();
const tree = new Tree({
  makeElement: (tag) => document.createElement(tag),
});
export const Popup = () => {
  const { state, trigger } = reflexio.useReflexio(
    (state: IState) => state.popup,
    ['openPopup'],
    Popup
  );
  //console.log('popuprender');
  //console.log(state.isOpen);
  ///state.isOpen, state.content, () => trigger('openPopup', 'close', null)

  return Window({
    show: state.isOpen,
    text: state.content,
    onBackground: () => trigger('openPopup', 'close', null),
    onCancel: () => trigger('openPopup', 'close', null),
    onNo: () => trigger('openPopup', 'no', null),
    onYes: () => trigger('openPopup', 'yes', null),
  });
};
