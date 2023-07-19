import {
  IMargin,
  IPadding,
  ISize,
  ITextColor,
  ITextMode,
} from '../theme/types';
import { sizeToHeaderClass, mToStyle, pToStyle } from '../theme/utils';
import cn from 'classnames';
//import React from 'react';
import './styles.less';
import { Tree } from '../../../../packages/core/lib/NTree';
import { Tags } from '../../../../packages/core/lib/Tags';

export interface IText extends IMargin, IPadding {
  size?: ISize;
  style?: any; //React.CSSProperties;
  color?: ITextColor;
  mode?: ITextMode;
  children?: any;
  onClick?: () => void;
}

export const Text = (tree: Tree | Tags, props: IText, key?: string) => {
  const headerSizeClass = props.size ? sizeToHeaderClass(props.size) : '';
  const className = cn(
    `oj-ui-text-${props.size || 'm'}`,
    `oj-ui-text-${props.color || 'on-background-plain'}`
  );

  return tree.tag(
    {
      child: props.children || null,
      tagName: 'p',
      eventListeners: {
        click: () => props.onClick,
      },
      attributes: {
        class: className,
        //style
      },
    },
    key
  );

  // return (
  //   <p
  //     onClick={props.onClick}
  //     style={{ ...props.style, ...mToStyle(props), ...pToStyle(props) }}
  //     className={className}
  //   >
  //     {props.children}
  //   </p>
  // );
};
