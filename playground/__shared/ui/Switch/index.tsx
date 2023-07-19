import './styles.less';
import {
  ISize,
  IMargin,
  IPadding,
  IButtonColor,
  ITextColor,
} from '../theme/types';
import React from 'react';
import cn from 'classnames';
import { mToStyle, pToStyle, sizeToButtonClass } from '../theme/utils';

interface ISwitch extends IMargin, IPadding {
  onChange?: () => void;
  value: boolean;
  size?: ISize;
  color?: IButtonColor;
  style?: React.CSSProperties;
}

export const Switch = (props: ISwitch) => {
  const sizeClass = props.size ? sizeToButtonClass(props.size) : '';
  const classes = cn('oj-ui-swch', sizeClass, props.color);

  return (
    <label
      style={{ ...props.style, ...mToStyle(props), ...pToStyle(props) }}
      className={`oj-ui-switch-${props.size || 'm'}`}
    >
      <input type='checkbox' />
      <span className='slider'></span>
    </label>
  );
};
