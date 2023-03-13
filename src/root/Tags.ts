import { ITagAttributes, Element, Tree } from './NTree';

export class Tags {
  constructor(private tree: Tree) {}

  public text(
    key: string,
    opts: {
      text: string;
      className?: string;
      style?: string;
      getNode?: (e: HTMLElement) => void;
      onClick?: (e) => void;
    }
  ) {
    return this.tree.tag({
      tagName: 'p',
      child: opts.text,
      key: key,
      getNode: opts.getNode,
      attributes: {},
      eventListeners: opts.onClick
        ? {
            click: opts.onClick,
          }
        : undefined,
    });
  }

  public headerText(
    key: string,
    opts: {
      text: string;
      size?: number;
      className?: string;
      style?: string;
      getNode?: (e: HTMLElement) => void;
      onClick?: (e) => void;
    }
  ) {
    return this.tree.tag({
      tagName: `h${opts.size || 1}`,
      child: opts.text,
      key: key,
      getNode: opts.getNode,
      attributes: {},
      eventListeners: opts.onClick
        ? {
            click: opts.onClick,
          }
        : undefined,
    });
  }

  public div(
    key: string,
    opts: {
      child?: Element | string;
      className?: string;
      style?: string;
      getNode?: (e: HTMLElement) => void;
      onClick?: (e) => void;
    }
  ) {
    return this.tree.tag({
      tagName: 'div',
      child: opts.child || '',
      key: key,
      getNode: opts.getNode,
      attributes: {},
      eventListeners: opts.onClick
        ? {
            click: opts.onClick,
          }
        : undefined,
    });
  }

  public button(
    key: string,
    opts: {
      child?: Element | string;
      className?: string;
      style?: string;
      getNode?: (e: HTMLElement) => void;
      onClick?: (e) => void;
    }
  ) {
    return this.tree.tag({
      tagName: 'button',
      child: opts.child || '',
      key: key,
      getNode: opts.getNode,
      attributes: {},
      eventListeners: opts.onClick
        ? {
            click: opts.onClick,
          }
        : undefined,
    });
  }
  public input(
    key: string,
    opts?: {
      value?: string;
      onChange?: (e) => void;
      className?: string;
      style?: string;
      getNode?: (e: HTMLElement) => void;
    }
  ) {
    return this.tree.tag({
      tagName: 'input',
      child: '',
      eventListeners:
        opts && opts.onChange
          ? {
              change: opts.onChange,
            }
          : undefined,
      key: key,
      getNode: opts && opts.getNode ? opts.getNode : undefined,
      attributes: {
        class: opts && opts.className ? opts.className : undefined,
        value: opts && opts.value ? opts.value : undefined,
      },
    });
  }
}
