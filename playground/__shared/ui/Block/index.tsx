/* eslint-disable @typescript-eslint/ban-ts-comment */
import './styles.less';
import { Tree } from '../../../../packages/core/lib/NTree';
import {
  ISize,
  IMargin,
  IPadding,
  IButtonColor,
  ITextColor,
  IBlockColor,
} from '../theme/types';
import cn from 'classnames';
import { mToStyle, pToStyle, sizeToButtonClass } from '../theme/utils';

interface ISmoothAppearance {
  type: 'opacity' | 'width' | 'height';
  duration?: string;
  at?: 'start' | 'center' | 'end';
}

interface IBlock extends IMargin, IPadding {
  onClick?: () => void;
  position?: 'relative | absolute | fixed | sticky';
  w?: string;
  h?: string;
  t?: string;
  b?: string;
  r?: string;
  l?: string;
  backgoundColor?: IBlockColor;
  style?: any;
  children?: any;
  border?: boolean; //'none | left | right | top | bottom';
  decoration?: 'none | rounder | shadow | shadow-rounded';
  hoverable?: boolean;
  smoothAppearance?: ISmoothAppearance;
}

export const Block = (tree: Tree, props: IBlock, key?: string) => {
  const borderClass = !props.border ? 'oj-ui-block-noborder' : '';
  const hoverableClass = !props.hoverable ? 'oj-ui-block-nohover' : '';
  const classes = cn(
    `oj-ui-block-${props.backgoundColor || 'transparent'}`,
    borderClass,
    hoverableClass,
    props.backgoundColor
  );

  //const [opacity, setOpacity] = useState<number>(0);

  let isZeroOpacity: boolean = false;

  if (props.smoothAppearance) {
    if (props.smoothAppearance.type === 'opacity') {
      isZeroOpacity = true;
    }
  }

  // useEffect(() => {
  //   if (props.smoothAppearance) {
  //     setOpacity(1);
  //   }
  // }, []);

  return tree.tag(
    {
      tagName: 'div',
      child: props.children,
      eventListeners:
        props && props.onClick
          ? {
              //@ts-ignore
              click: () => props.onClick(),
            }
          : undefined,
      attributes: {
        class: classes,
        style: {
          ...props.style,
          ...mToStyle(props),
          ...pToStyle(props),
        },
      },
    },
    key
  );

  // return (
  //   <div
  //     onClick={props.onClick}
  //     style={{
  //       ...props.style,
  //       ...mToStyle(props),
  //       ...pToStyle(props),
  //       opacity: isZeroOpacity ? opacity : 1,
  //       transition: isZeroOpacity
  //         ? `all ${props.smoothAppearance.duration}`
  //         : undefined,
  //     }}
  //     className={classes}
  //   >
  //     {props.children}
  //   </div>
  // );
};
