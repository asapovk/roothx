/* eslint-disable @typescript-eslint/ban-ts-comment */
import './styles.less';
import { ISize, IMargin, IPadding, IButtonColor } from '../theme/types';
import React from 'react';
import ReactDOM from 'react-dom';
import { mToStyle, pToStyle } from '../theme/utils';
import cn from 'classnames';

interface ISidePop {
  isOpen: boolean;
  style?: React.CSSProperties;
  children?: any;
}

export const SidePop = (props: ISidePop) => {
  if (!props.isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className='sidepop-wrapper'>
      <div className='sidepop-background'></div>
      <div className='sidepop-window'>{props.children}</div>
    </div>,
    document.getElementById('app')
  );
};
