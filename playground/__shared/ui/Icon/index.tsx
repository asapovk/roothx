import React from 'react';
import { IMargin, IPadding, ISize, ITextColor } from '../theme/types';
import cn from 'classnames';
import './styles.less';
import { sizeToHeaderClass, mToStyle, pToStyle } from '../theme/utils';

export interface IconProps extends IMargin, IPadding {
  className?: string;
  size?: ISize;
  onClick?: () => void;
  color?: ITextColor;
  muted?: boolean;
  viewBox?: string;
  style?: React.CSSProperties;
  children?: any;
}

export const Icon = (props: IconProps) => {
  const cl = cn(
    'oj-ui-icon',
    props.size,
    props.color ? `icon_${props.color}` : 'icon_on-background',
    props.onClick ? 'clickable' : '',
    props.muted ? 'muted' : '',
    props.className
  );

  return (
    <svg
      onClick={props.onClick}
      style={{
        display: 'inline-block',
        userSelect: 'none',
        ...pToStyle(props),
        ...mToStyle(props),
        ...props.style,
      }}
      className={cl}
      viewBox={props.viewBox || '0 0 24 24'}
    >
      {props.children}
    </svg>
  );
};
