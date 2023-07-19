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

interface IButton extends IMargin, IPadding {
  onClick?: () => void;
  size?: ISize;
  color?: IButtonColor;
  decoration?: IButtonDecoration;
  children?: any;
  style?: React.CSSProperties;
  w?: string;
  h?: string;
}

export const Button = (props: IButton) => {
  const decoration = `btn-${props.decoration || 'outline'}`;
  const classes = cn(
    'oj-ui-btn',
    props.size,
    decoration,
    props.color || 'primary'
  );

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
