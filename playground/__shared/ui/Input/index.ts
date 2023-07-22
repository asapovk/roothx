/* eslint-disable @typescript-eslint/ban-ts-comment */
import './styles.less';
import { ISize, IMargin, IPadding, IButtonColor } from '../theme/types';
import { Element, Tree } from '../../../../packages/core/lib/NTree';
import { Style, StyleOpts } from '../../../../packages/core/lib/Style';
import { Tags } from '../../../../packages/core/lib/Tags';
import { mToStyle, pToStyle } from '../theme/utils';
import cn from 'classnames';

interface ITextInput extends IMargin, IPadding {
  onFocus?: () => void;
  onBlur?: () => void;
  onChange?: (e: any) => void;
  placeholder?: string;
  value?: string;
  pattern?: string;
  label?: string | Element;
  size?: ISize;
  type?: 'text' | 'password';
  color?: IButtonColor;
  leftIcon?: Element;
  rightIcon?: Element;
  style?: StyleOpts;
  w?: string;
}

export const TextInput = (tree: Tags, props: ITextInput, key: string) => {
  const st = new Style().makeStyle({
    ...props.style,
    ...mToStyle(props),
    ...pToStyle(props),
    width: props.w,
  });

  return tree.div(
    {
      className: cn(
        `oj-ui-text-input-${props.size || 'm'}`,
        `oj-ui-text-input-${props.color || 'primary'}`
      ),
      style: st,
      child: [
        props.label || null,
        props.leftIcon || null,
        props.rightIcon || null,
        tree.textInput(
          {
            pattern: props.pattern,
            value: props.value,
            type: props.type || 'text',
            placeholder: props.placeholder,
            onChange: props.onChange,
          },
          `${key}_input`
        ),
      ],
    },
    key
  );
};
