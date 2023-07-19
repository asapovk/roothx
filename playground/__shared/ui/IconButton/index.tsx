import './styles.less';
import {
  ISize,
  IMargin,
  IPadding,
  IButtonColor,
  ITextColor,
  IButtonDecoration,
} from '../theme/types';
import React from 'react';
import cn from 'classnames';
import { mToStyle, pToStyle, sizeToButtonClass } from '../theme/utils';

interface IIconButton extends IMargin, IPadding {
  onClick?: () => void;
  children?: any;
  style?: React.CSSProperties;
  w?: string;
  h?: string;
  size?: ISize;
}

export const IconButton = (props: IIconButton) => {
  const classes = cn('oj-ui-icon-btn', props.size);

  return (
    <button
      style={{
        ...props.style,
        ...mToStyle(props),
        ...pToStyle(props),
        minWidth: props.w,
        minHeight: props.h,
      }}
      className={classes}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
