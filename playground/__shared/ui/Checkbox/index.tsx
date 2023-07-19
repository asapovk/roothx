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

interface ICheckbox extends IMargin, IPadding {
  onChange?: () => void;
  value?: boolean;
  size?: ISize;
  ki?: string;
  color?: IButtonColor;
  style?: React.CSSProperties;
  children?: any;
}

export const Checkbox = (props: ICheckbox) => {
  const sizeClass = props.size ? sizeToButtonClass(props.size) : '';
  const classes = cn('oj-ui-checkbox', sizeClass, props.color);

  return (
    <div
      className='checkbox-wrapper-4'
      style={{ ...props.style, width: '40px' }}
    >
      <input className='hidden-input' id={props.ki} type='checkbox' />
      <label className='cbx' htmlFor={props.ki}>
        <span>
          <svg width='12px' height='10px'>
            <use xlinkHref='#check-4'></use>
          </svg>
        </span>
        {/* <span style={{ display: 'inline-block' }}>{props.children}</span> */}
      </label>
      <svg className='check-line'>
        <symbol id='check-4' viewBox='0 0 12 10'>
          <polyline points='1.5 6 4.5 9 10.5 1'></polyline>
        </symbol>
      </svg>
    </div>
  );
};
