/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Tree } from './Tree';
import { Element } from './Tree';

export class Root<T> extends Tree<T> {
  public root(opts: {
    key: string;
    child: string | Element | Array<Element>;
    style?: string;
    onClick?: () => void;
  }) {
    //console.log(this.cleanFactory)
    if (!this.rootElement) {
      //console.log(`mount root ${opts.key}`)
      this.mountRoot(opts.key, opts.child, opts.style, opts.onClick);
    } else {
      //console.log(`update root ${opts.key}`)
      this.updateRoot(opts.key, opts.child, opts.style, opts.onClick);
    }
  }

  public unmountRoot = () => {
    if (this.cleanFactory) {
      this.cleanFactory();
    }
    //@ts-ignore
    this.rootElement.node.remove();
    this.rootElement = undefined;
    this.elements = {};
  };

  private mountRoot(
    key: string,
    child: string | Element | Array<Element>,
    style?: string,
    onClick?: () => void
  ) {
    // this.elements[key] = child
    const divElement = document.createElement('div');
    if (typeof child === 'string') {
      divElement.textContent = child;
    } else if (Array.isArray(child)) {
      child.forEach((ch) => {
        if (!ch) {
          return;
        }
        ch.parentId = key;
        if (ch.type === 'root') {
          this.touchedElements.push(ch.id);
          this.elements[ch.id] = ch;
        }
        divElement.appendChild(ch.node);
      });
    } else if (child !== null) {
      if (child.type === 'root') {
        this.touchedElements.push(child.id);
        this.elements[child.id] = child;
      }
      child.parentId = key;
      divElement.appendChild(child.node);
    }
    if (style) {
      divElement.setAttribute('style', style);
    }
    if (onClick) {
      divElement.addEventListener('click', onClick);
    }
    this.rootElement = {
      type: 'root',
      clean: this.unmountRoot,
      attributes: {
        class: null as any,
        innerText: null as any,
        style: style,
        eventListener: onClick,
      },
      node: divElement,
      id: key,
      parentId: null,
    };
  }

  private updateRoot(
    key: string,
    child: string | Element | Array<Element>,
    style?: string,
    onClick?: () => void
  ) {
    const oldElement = this.rootElement as Element;
    const text = typeof child === 'string' ? child : null;
    const isStyleChanged = style && style !== oldElement.attributes.style;
    const isTextChanged = text !== oldElement.attributes.innerText;
    if (isStyleChanged) {
      oldElement.attributes.style = style;
      oldElement.node.setAttribute('style', style);
    }
    if (isTextChanged) {
      //@ts-ignore
      oldElement.attributes.innerText = text;
      oldElement.node.textContent = text;
    }
    if (onClick) {
      oldElement.node.removeEventListener(
        'click',
        oldElement.attributes.eventListener
      );
      oldElement.node.addEventListener('click', onClick);
      oldElement.attributes.eventListener = onClick;
    }
    if (Array.isArray(child)) {
      let lastNonNullIndex = 0;
      child.forEach((ch, index) => {
        if (!ch) {
          return;
        } else {
          lastNonNullIndex = index;
        }
        if (ch.type === 'root') {
          this.touchedElements.push(ch.id);
          this.elements[ch.id] = ch; // mount to tree
        }
        if (!ch.parentId) {
          ch.parentId = oldElement.id;
          if (!index) {
            oldElement.node.prepend(ch.node);
          } else {
            const prevNode = child[lastNonNullIndex - 1].node;
            prevNode.after(ch.node);
          }
        }
      });
    } else if (child && typeof child !== 'string') {
      if (child.type === 'root') {
        this.touchedElements.push(child.id);
        this.elements[child.id] = child; // mount to tree
      }
      if (!child.parentId) {
        child.parentId = oldElement.id;
        oldElement.node.appendChild(child.node);
      }
    }
  }
}
