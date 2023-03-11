/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Tree, Element } from './Tree';

export class Div<T> extends Tree<T> {
  private updateElement(
    key: any,
    child: string | Element | Array<Element>,
    style: string,
    onClick?: () => void
  ) {
    const oldElement = this.elements[key] as Element;
    //this.findElement()
    const isStyleChanged = style !== oldElement.attributes.style;
    const text = typeof child === 'string' ? child : null;
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
          if (!lastNonNullIndex) {
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

    return oldElement;
  }

  protected mountElement(
    key: any,
    child: string | Element | Array<Element>,
    style: string,
    onClick?: () => void
  ) {
    // this.elements[key] = child
    // create unique key
    const divElement = document.createElement('div');

    if (Array.isArray(child)) {
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
    } else if (typeof child === 'string') {
      divElement.textContent = child;
    } else {
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
    this.elements[key] = {
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

    return this.elements[key];
  }
}
