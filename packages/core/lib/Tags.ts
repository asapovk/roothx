import { ITagAttributes, Element, Tree } from './NTree';

export class Tags {
  public tree: Tree;
  public root: Tree['root'];
  public tag: Tree['tag'];
  constructor(tree: Tree) {
    this.tree = tree; 
    this.root = (args, key) => this.tree.root(args, key);
    this.tag = (args, key) => this.tree.tag(args, key);
  }

  public text(
    opts: {
      text: string;
      className?: string;
      style?: string;
      withNode?: (e: HTMLElement, isMounting) => void;
      onClick?: (e) => void;
    },
    key?: string
  ) {
    return this.tree.tag(
      {
        tagName: 'p',
        child: opts.text,
        withNode: opts.withNode,
        attributes: {},
        eventListeners: opts.onClick
          ? {
              click: opts.onClick,
            }
          : undefined,
      },
      key
    );
  }

  public headerText(
    opts: {
      text: string;
      size?: number;
      className?: string;
      style?: string;
      withNode?: (e: HTMLElement, isMounting: boolean) => void;
      onClick?: (e) => void;
    },
    key?: string
  ) {
    return this.tree.tag(
      {
        tagName: `h${opts.size || 1}`,
        child: opts.text,
        withNode: opts.withNode,
        attributes: {},
        eventListeners: opts.onClick
          ? {
              click: opts.onClick,
            }
          : undefined,
      },
      key
    );
  }

  public div(
    opts: {
      child?: Array<Element | string | null> | Element | string | null;
      className?: string;
      style?: string;
      withNode?: (e: HTMLElement, isMounting: boolean) => void;
      onClick?: (e) => void;
    },
    key?: string
  ) {
    return this.tree.tag(
      {
        tagName: 'div',
        child: opts.child || ('' as string),
        withNode: opts.withNode,
        attributes: {
          class: opts.className,
          style: opts.style,
        },
        eventListeners: opts.onClick
          ? {
              click: opts.onClick,
            }
          : undefined,
      },
      key
    );
  }

  public button = (
    opts: {
      child?: Element | string | null | Array<Element>;
      className?: string;
      style?: string;
      withNode?: (e: HTMLElement, isMounting: boolean) => void;
      onClick?: (e) => void;
    },
    key?: string
  ) =>
    this.tag(
      {
        tagName: 'button',
        child: opts.child || '',
        withNode: opts.withNode,
        attributes:
          opts && opts.className
            ? {
                class: opts.className,
              }
            : {},
        eventListeners: opts.onClick
          ? {
              click: opts.onClick,
            }
          : undefined,
      },
      key
    );
  public textArea(
    opts: {
      id?: string;
      value?: string;
      onChange?: (e) => void;
      onFocus?: (e) => void;
      placeholder?: string;
      pattern?: string;
      disabled?: boolean;
      className?: string;
      style?: string;
      withNode?: (e: HTMLElement, isMounting: boolean) => void;
    },
    key?: string
  ) {
    return this.tree.tag(
      {
        tagName: 'textarea',
        child: '',
        eventListeners:
          opts && opts.onChange
            ? {
                change: opts.onChange,
              }
            : undefined,
        withNode: opts && opts.withNode ? opts.withNode : undefined,
        attributes: {
          id: opts && opts.id ? opts.id : undefined,
          class: opts && opts.className ? opts.className : undefined,
          value: opts && opts.value ? opts.value : undefined,
        },
      },
      key
    );
  }

  public textInput(
    opts: {
      value?: string;
      onChange?: (e) => void;
      onFocus?: (e) => void;
      placeholder?: string;
      pattern?: string;
      disabled?: boolean;
      type?: 'text' | 'password';
      className?: string;
      style?: string;
      withNode?: (e: HTMLElement, isMounting: boolean) => void;
    },
    key?: string
  ) {
    return this.tree.tag(
      {
        tagName: 'input',
        child: '',
        eventListeners:
          opts && opts.onChange
            ? {
                change: opts.onChange,
              }
            : undefined,
        withNode: opts && opts.withNode ? opts.withNode : undefined,
        attributes: {
          class: opts && opts.className ? opts.className : undefined,
          value: opts && opts.value ? opts.value : undefined,
        },
      },
      key
    );
  }
}
