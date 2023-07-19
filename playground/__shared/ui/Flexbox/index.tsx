import { IMargin, IPadding, ISize, ITextColor } from '../theme/types';
import { sizeToHeaderClass, mToStyle, pToStyle } from '../theme/utils';
import cn from 'classnames';
import React from 'react';
import './styles.less';

export interface IFlexbox extends IMargin, IPadding {
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around';
  alignItems?: 'flex-start' | 'flex-end' | 'center';
  children?: any;
  column?: boolean;
  style?: React.CSSProperties;
}

export const Flexbox = (props: IFlexbox) => {
  const className = cn('oj-ui-flexbox', props.column ? 'column' : '');
  const style = {
    ...props.style,
    justifyContent: props.justifyContent || 'center',
    alignItems: props.alignItems || 'center',
  };

  return (
    <div
      style={{ ...style, ...mToStyle(props), ...pToStyle(props) }}
      className={className}
    >
      {props.children}
    </div>
  );
};
