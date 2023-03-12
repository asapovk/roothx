/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Style, StyleOpts } from './Style';

interface Attributes {
  class?: string;
  style?: string;
  value?: string;
  id?: string;
}

interface Element {
  id: string;
  parentId: string | null;
  node: HTMLElement;
  innerText?: string;
  attributes: Attributes;
  eventListeners: any;
  isRoot: boolean;
  tagName: string;
  clean?: () => void;
}

export function Root(element: HTMLElement): void {
  const rootElement = document.getElementById('app');
  if (rootElement) {
    rootElement.appendChild(element);
  }
}

export class TreeFactory<T> {
  private instances: { [key: string]: Tree<T> } = {};

  public getInstance(key: string): Tree<T> {
    if (this.instances[key]) {
      return this.instances[key];
    } else {
      this.instances[key] = new Tree(
        { makeElement: (name) => document.createElement(name) },
        () => {
          delete this.instances[key];
        }
      );

      return this.instances[key];
    }
  }
}

//interface HTMLElement

interface ITreeOpts {
  makeElement: (tagName: string) => HTMLElement;
}

export class Tree<T> {
  private cleanFactory: any = null;
  constructor(private opts: ITreeOpts, cleanFactory?: () => void) {
    if (cleanFactory) {
      this.cleanFactory = cleanFactory;
    }
  }

  private rootElement?: Element;

  private elements: { [key: string]: Element } = {};

  private touchedElements: Array<{ [key: string]: boolean }> = [];

  public root(opts: {
    key: string;
    child: string | Element | Array<Element>;
    arrtibutes: {
      style?: string;
    };
    eventListeners: { [eventName: string]: (e: any) => void };
  }) {
    //console.log(this.cleanFactory)
    if (!this.rootElement) {
      //console.log(`mount root ${opts.key}`)
      this.mountRoot(
        opts.key,
        opts.child,
        opts.arrtibutes,
        opts.eventListeners
      );
    } else {
      //console.log(`update root ${opts.key}`)
      this.updateRoot(opts.child, opts.arrtibutes, opts.eventListeners);
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

  public calc() {
    for (const k in this.elements) {
      if (!this.touchedElements[k]) {
        this.unmountElement(k);
      }
    }
    //@ts-ignore
    this.touchedElements = {};

    return this.rootElement;
  }

  public tag(opts: {
    key: string;
    tagName: string;
    child: Array<Element> | Element | string;
    attributes: {
      value?: string;
      style?: string;
      id?: string;
      class?: string;
    };
    eventListeners?: { [eventName: string]: (e: any) => void };
    getNode?: (el: HTMLElement) => void;
  }) {
    let elem: Element;
    if (!this.elements[opts.key as any]) {
      elem = this.mountElement(
        opts.key,
        opts.tagName,
        opts.child,
        opts.attributes,
        opts.eventListeners
      );
      if (opts.getNode) {
        opts.getNode(elem.node);
      }
    } else {
      elem = this.updateElement(
        opts.key,
        opts.child,
        opts.attributes,
        opts.eventListeners
      );
    }

    this.touchedElements[opts.key as string] = true;

    return elem;
  }

  private mountRoot(
    key: string,
    child: string | Element | Array<Element>,
    attributes: ITagAttributes,
    eventListeners: { [eventName: string]: (e: any) => void }
  ) {
    // this.elements[key] = child
    const divElement = this.opts.makeElement('div');
    //const divElement = document.createElement('div');
    this.mountNoneTextChilds(key, divElement, child as any);

    // if (typeof child === 'string') {
    //   divElement.textContent = child;
    // } else if (Array.isArray(child)) {
    //   child.forEach((ch) => {
    //     if (!ch) {
    //       return;
    //     }
    //     ch.parentId = key;
    //     if (ch.isRoot) {
    //       this.touchedElements[ch.id];
    //       this.elements[ch.id] = ch;
    //     }
    //     divElement.appendChild(ch.node);
    //   });
    // } else if (child !== null) {
    //   if (child.isRoot) {
    //     this.touchedElements[child.id];
    //     this.elements[child.id] = child;
    //   }
    //   child.parentId = key;
    //   divElement.appendChild(child.node);
    // }

    // if (style) {
    //   divElement.setAttribute('style', style);
    // }
    // if (onClick) {
    //   divElement.addEventListener('click', onClick);
    // }
    this.rootElement = {
      isRoot: true,
      tagName: 'div',
      innerText: null as any,
      clean: this.unmountRoot,
      attributes: attributes,
      eventListeners,
      node: divElement,
      id: key,
      parentId: null,
    };
  }

  private updateRoot(
    child: string | Element | Array<Element>,
    attributes: ITagAttributes,
    eventListeners?: { [eventName: string]: (e: any) => void }
  ) {
    const oldElement = this.rootElement as Element;
    this.updateNoneTextChilds(oldElement, child as any);
    // if (Array.isArray(child)) {
    //   let lastNonNullIndex = 0;
    //   child.forEach((ch, index) => {
    //     if (!ch) {
    //       return;
    //     } else {
    //       lastNonNullIndex = index;
    //     }
    //     if (ch.isRoot) {
    //       this.touchedElements[ch.id];
    //       this.elements[ch.id] = ch; // mount to tree
    //     }
    //     if (!ch.parentId) {
    //       ch.parentId = oldElement.id;
    //       if (!index) {
    //         oldElement.node.prepend(ch.node);
    //       } else {
    //         const prevNode = child[lastNonNullIndex - 1].node;
    //         prevNode.after(ch.node);
    //       }
    //     }
    //   });
    // } else if (child && typeof child !== 'string') {
    //   if (child.isRoot) {
    //     this.touchedElements[child.id];
    //     this.elements[child.id] = child; // mount to tree
    //   }
    //   if (!child.parentId) {
    //     child.parentId = oldElement.id;
    //     oldElement.node.appendChild(child.node);
    //   }
    // }
  }

  private updateElement(
    key: any,
    child: string | Element | Array<Element>,
    attributes: {
      style?: string;
      class?: string;
      id?: string;
    },
    eventListeners?: { [eventName: string]: (e) => void }
  ) {
    const oldElement = this.elements[key] as Element;
    //this.findElement()
    // const isStyleChanged = style !== oldElement.attributes.style;
    // const text = typeof child === 'string' ? child : null;
    // const isTextChanged = text !== oldElement.attributes.innerText;
    // if (isStyleChanged) {
    //   oldElement.attributes.style = style;
    //   oldElement.node.setAttribute('style', style);
    // }
    // if (isTextChanged) {
    //   //@ts-ignore
    //   oldElement.attributes.innerText = text;
    //   oldElement.node.textContent = text;
    // }
    // if (onClick) {
    //   oldElement.node.removeEventListener(
    //     'click',
    //     oldElement.attributes.eventListener
    //   );
    //   oldElement.node.addEventListener('click', onClick);
    //   oldElement.attributes.eventListener = onClick;
    // }

    this.updateNoneTextChilds(oldElement, child as any);

    return oldElement;
  }

  private mountElement(
    key: any,
    tagName: string,
    child: string | Element | Array<Element>,
    attributes: {
      id?: string;
      style?: string;
      class?: string;
    },
    eventListeners?: { [eventName: string]: (e: any) => void }
  ) {
    // this.elements[key] = child
    // create unique key
    const divElement = this.opts.makeElement(tagName);
    this.mountNoneTextChilds(key, divElement, child as any);

    // if (Array.isArray(child)) {
    //   child.forEach((ch) => {
    //     if (!ch) {
    //       return;
    //     }
    //     ch.parentId = key;
    //     if (ch.isRoot) {
    //       this.touchedElements[ch.id];
    //       this.elements[ch.id] = ch;
    //     }
    //     divElement.appendChild(ch.node);
    //   });
    // } else if (typeof child === 'string') {
    //   divElement.textContent = child;
    // } else {
    //   if (child.isRoot) {
    //     this.touchedElements[child.id];
    //     this.elements[child.id] = child;
    //   }
    //   child.parentId = key;
    //   divElement.appendChild(child.node);
    // }
    // if (style) {
    //   divElement.setAttribute('style', style);
    // }
    // if (onClick) {
    //   divElement.addEventListener('click', onClick);
    // }
    this.elements[key] = {
      isRoot: false,
      tagName,
      attributes,
      innerText: null as any,
      eventListeners,
      node: divElement,
      id: key,
      parentId: null,
    };

    return this.elements[key];
  }

  private unmountElement(key: string) {
    //console.log(`Unmount ${key}`)
    if (this.elements[key].isRoot) {
      //@ts-ignore
      this.elements[key].clean();
    } else {
      this.elements[key].node.remove();
    }
    delete this.elements[key];
  }

  private mountNoneTextChilds = (
    parentKey: string,
    parentTag: HTMLElement,
    child: Element
  ) => {
    if (Array.isArray(child)) {
      child.forEach((ch) => {
        if (!ch) {
          return;
        }
        ch.parentId = parentKey;
        if (ch.isRoot) {
          this.touchedElements[ch.id];
          this.elements[ch.id] = ch;
        }
        parentTag.appendChild(ch.node);
      });
    } else if (typeof child === 'string') {
      parentTag.textContent = child;
    } else {
      if (child.isRoot) {
        this.touchedElements[child.id];
        this.elements[child.id] = child;
      }
      child.parentId = parentKey;
      parentTag.appendChild(child.node);
    }
  };

  private updateNoneTextChilds = (oldElement: Element, child: Element) => {
    if (!child) {
      return;
      //@ts-ignore
    } else if (child.id) {
      if (child.isRoot) {
        this.touchedElements[child.id];
        this.elements[child.id] = child; // mount to tree
      }
      if (!child.parentId) {
        child.parentId = oldElement.id;
        oldElement.node.appendChild(child.node);
      }
    } else if (Array.isArray(child)) {
      let lastNonNullIndex = 0;
      child.forEach((ch, index) => {
        if (!ch) {
          return;
        } else {
          lastNonNullIndex = index;
        }
        if (ch.isRoot) {
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
    }
    // child can be a string or Element or array of elements
  };
}

/* new Html (config) - sets up custom
 **
 ** Elemetnt creator
 ** Child appender
 ** Element deleter
 **
 */

interface ITagAttributes {
  class?: string;
  value?: string;
  style?: string;
}
