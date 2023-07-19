import { IMargin, IPadding, ISize, ITextColor } from '../theme/types';
import { sizeToHeaderClass, mToStyle, pToStyle } from '../theme/utils';
import cn from 'classnames';
import React from 'react';
import './styles.less';

export interface IHeader extends IMargin, IPadding {
  size?: ISize;
  color?: ITextColor;
  children?: any;
}

export const Header = (props: IHeader) => {
  const headerSizeClass = props.size ? sizeToHeaderClass(props.size) : '';
  const className = cn(
    'oj-ui-h',
    headerSizeClass,
    `oj-ui-h-${props.color || 'on-background-strong'}`
  );

  return (
    <h1
      style={{ ...mToStyle(props), ...pToStyle(props) }}
      className={className}
    >
      {props.children}
    </h1>
  );
};
