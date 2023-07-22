/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IMargin, IPadding, ISize, ITextColor } from '../theme/types';
import cn from 'classnames';
import './styles.less';
import { sizeToHeaderClass, mToStyle, pToStyle } from '../theme/utils';
import { Tree, Element } from '../../../../packages/core/lib/NTree';
import { Tags } from '../../../../packages/core/lib/Tags';
import { Style } from '../../../../packages/core/lib/Style';

export interface IconProps extends IMargin, IPadding {
  className?: string;
  size?: ISize;
  onClick?: () => void;
  color?: ITextColor;
  muted?: boolean;
  viewBox?: string;
  style?: any;
  child?: Element;
  height?: string;
  width?: string;
}

export const Icon = (tree: Tree | Tags, props: IconProps, key: string) => {
  const cl = cn(
    'oj-ui-icon',
    props.size,
    props.color ? `icon_${props.color}` : 'icon_on-background',
    props.onClick ? 'clickable' : '',
    props.muted ? 'muted' : '',
    props.className
  );
  const st = new Style().makeStyle({
    ...props.style,
    ...mToStyle(props),
    ...pToStyle(props),
  });

  return tree.tag(
    {
      tagName: 'svg',
      eventListeners: props.onClick
        ? {
            //@ts-ignore
            click: () => props.onClick(),
          }
        : undefined,
      attributes: {
        class: cl,
        viewBox: props.viewBox || '0 0 25 25',
        // width: props.width || '25',
        // height: props.height || '25',
        style: `${st} display: inline-block; user-select: none;`,
      },
      child: props.child || null,
    },
    `${key}_inp`
  );
  //   onClick={props.onClick}
  //   style={{
  //     display: 'inline-block',
  //     userSelect: 'none',
  //     ...pToStyle(props),
  //     ...mToStyle(props),
  //     ...props.style,
  //   }}

  //   className={cl}
  //   viewBox={props.viewBox || '0 0 24 24'}
  // >
  //   {props.children}
  // </svg>
};
