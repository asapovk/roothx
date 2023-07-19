import { Element, Tree } from '../../../packages/core/lib/NTree';
import './styles.css';
import cn from 'classnames';

export interface ITextInput {
  onClick: () => void;
  child: Element;
}

export const Button = (key: string, tree: Tree, opts: ITextInput) => {
  const combineClassNames = cn(
    'root'
    // s[size],
    // !propChildren && s.empty,
    // disabled && s.disabled,
    // isLoading && s.loading,
    // className
  );

  return tree.tag(
    {
      tagName: 'button',
      attributes: {
        class: combineClassNames,
      },
      eventListeners: {
        click: opts.onClick,
      },
      child: opts.child,
    },
    key
  );
};
