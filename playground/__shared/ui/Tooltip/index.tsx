import React, { useState } from 'react';
import './styles.less';

export interface ITooltip {
  children?: any;
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  value: string;
  zIndex?: string;
}

export const Tooltip = (props: ITooltip) => {
  const [isShown, setShown] = useState(false);

  return (
    <div
      className={'oj-ui-tooltip-wrapper'}
      onMouseOver={() => setShown(true)}
      onMouseLeave={() => setShown(false)}
    >
      <div
        className={'oj-ui-tooltip'}
        style={{
          display: !isShown ? 'none' : undefined,
          bottom: props.bottom,
          top: props.top,
          left: props.left,
          right: props.right,
          zIndex: props.zIndex || 12,
        }}
      >
        {props.value}
      </div>
      {props.children}
    </div>
  );
};
