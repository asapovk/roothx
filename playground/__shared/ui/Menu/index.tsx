import { IMargin, IPadding, ISize, ITextColor } from '../theme/types';
import { sizeToHeaderClass, mToStyle, pToStyle } from '../theme/utils';
import cn from 'classnames';
import React, { useState } from 'react';
import './styles.less';

export interface IMenu extends IMargin, IPadding {
  size?: ISize;
  style?: React.CSSProperties;
  color?: ITextColor;
  items: Array<string>;
  defaultSelection?: number;
  onSelect: (number: number) => void;
}

export const Menu = (props: IMenu) => {
  const [selected, setSelected] = useState<number | null | undefined>(
    props.defaultSelection
  );

  const selectedCn = cn('menu-item', 'item-selected');

  return (
    <ul
      style={{
        ...pToStyle(props),
        ...mToStyle(props),
        ...props.style,
      }}
      className={cn(
        `oj-ui-menu-color-${props.color || 'primary'}`,
        `oj-ui-menu-size-${props.size || 'm'}`
      )}
    >
      {props.items.map((it, index) => (
        <li
          className={selected === index ? selectedCn : 'menu-item'}
          key={index}
          onClick={() => {
            setSelected(index);
            props.onSelect(index);
          }}
        >
          {it}
        </li>
      ))}
    </ul>
  );
};
