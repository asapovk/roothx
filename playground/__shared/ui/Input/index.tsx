/* eslint-disable @typescript-eslint/ban-ts-comment */
import './styles.less';
import { ISize, IMargin, IPadding, IButtonColor } from '../theme/types';
import React from 'react';
import { mToStyle, pToStyle } from '../theme/utils';
import cn from 'classnames';

interface ITextInput extends IMargin, IPadding {
  onFocus?: () => void;
  onBlur?: () => void;
  onChange?: (e: any) => void;
  placeholder?: string;
  value?: string;
  pattern?: string;
  label?: string | JSX.Element;
  size?: ISize;
  type?: 'text' | 'password';
  color?: IButtonColor;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  style?: React.CSSProperties;
  w?: string;
}

export const TextInput = (props: ITextInput) => (
  <div
    className={cn(
      `oj-ui-text-input-${props.size || 'm'}`,
      `oj-ui-text-input-${props.color || 'primary'}`
    )}
    style={{
      ...props.style,
      ...mToStyle(props),
      ...pToStyle(props),
      width: props.w,
    }}
  >
    {props.label}
    {props.leftIcon}
    {props.rightIcon}
    <input
      pattern={props.pattern}
      value={props.value}
      type={props.type || 'text'}
      placeholder={props.placeholder}
      onChange={props.onChange}
    />
  </div>
);
