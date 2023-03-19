/* eslint-disable @typescript-eslint/ban-ts-comment */

export interface ITagAttributes {
  class?: string;
  style?: string;
  value?: string;
  id?: string;
}

export interface ITagListeners {
  [eventName: string]: (e: any) => void;
}

export interface Element {
  id: string;
  parentId: string | null;
  node: HTMLElement;
  innerText?: string;
  attributes: ITagAttributes;
  eventListeners: ITagListeners;
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

export class TreeFactory {
  private instances: { [key: string]: Tree } = {};

  public getInstance(key: string): Tree {
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

export class Tree {
  private cleanFactory: any = null;
  constructor(private opts: ITreeOpts, cleanFactory?: () => void) {
    if (cleanFactory) {
      this.cleanFactory = cleanFactory;
    }
  }

  private rootElement?: Element;

  private elements: { [key: string]: Element } = {};

  private touchedElements: { [key: string]: boolean } = {};

  private onUnmountRoot: () => void;

  public root(opts: {
    key: string;
    child:
      | string
      | Element
      | Array<Element | null | undefined>
      | null
      | undefined;
    attributes?: ITagAttributes;
    eventListeners?: ITagListeners;
    onMount?: () => void;
    onUpdate?: () => void;
    onUnmount?: () => void;
  }) {
    if (!this.rootElement) {
      this.mountRoot(
        opts.key,
        opts.child as Element,
        opts.attributes,
        opts.eventListeners
      );
      if (opts.onMount) {
        setTimeout(opts.onMount);
      }
      if (opts.onUnmount) {
        this.onUnmountRoot = opts.onUnmount;
      }
    } else {
      //@ts-ignore
      this.rootElement.id = opts.key;
      this.updateRoot(
        opts.child as Element,
        opts.attributes,
        opts.eventListeners
      );
      if (opts.onUpdate) {
        setTimeout(opts.onUpdate);
      }
    }

    return this.calc();
  }

  public unmountRoot = () => {
    if (this.cleanFactory) {
      this.cleanFactory();
    }
    //@ts-ignore
    this.rootElement.node.remove(); //async
    if (this.onUnmountRoot) {
      this.onUnmountRoot();
    }
    this.rootElement = undefined;
    this.elements = {};
  };

  private calc() {
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
    child:
      | Array<Element | null | undefined>
      | Element
      | string
      | null
      | undefined;
    attributes: {
      value?: string;
      style?: string;
      id?: string;
      class?: string;
    };
    eventListeners?: ITagListeners;
    getNode?: (el: HTMLElement) => void;
  }) {
    let elem: Element;

    if (!this.elements[opts.key as any]) {
      elem = this.mountElement(
        opts.key,
        opts.tagName,
        opts.child as Element,
        opts.attributes,
        opts.eventListeners
      );
      if (opts.getNode) {
        opts.getNode(elem.node);
      }
    } else {
      elem = this.updateElement(
        opts.key,
        opts.child as Element,
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
    attributes: ITagAttributes = {},
    eventListeners?: ITagListeners
  ) {
    const divElement = this.opts.makeElement('div');
    this.mountNoneTextChilds(key, divElement, child as any);
    if (typeof child === 'string') {
      divElement.textContent = child;
    }
    this.rootElement = {
      isRoot: true,
      tagName: 'div',
      innerText: typeof child === 'string' ? child : (null as any),
      clean: this.unmountRoot,
      attributes: {},
      eventListeners: {},
      node: divElement,
      id: key,
      parentId: null,
    };
    this.updateAttributes(this.rootElement, attributes);
    this.updateEventListeners(this.rootElement, eventListeners);
  }

  private updateRoot(
    child: string | Element | Array<Element>,
    attributes?: ITagAttributes,
    eventListeners?: { [eventName: string]: (e: any) => void }
  ) {
    const oldElement = this.rootElement as Element;
    if (oldElement.innerText && typeof child !== 'string') {
      oldElement.node.innerText = null;
    }
    this.updateNoneTextChilds(oldElement, child as any);
    this.updateAttributes(oldElement, attributes);
    this.updateEventListeners(oldElement, eventListeners);
    if (typeof child === 'string') {
      if (child !== oldElement.node.textContent) {
        oldElement.innerText = child;
        oldElement.node.textContent = child;
      }
    }
  }

  private updateElement(
    key: any,
    child: string | Element | Array<Element>,
    attributes: {
      style?: string;
      class?: string;
      id?: string;
    },
    eventListeners?: ITagListeners
  ) {
    const oldElement = this.elements[key] as Element;
    if (oldElement.innerText && typeof child !== 'string') {
      oldElement.node.innerText = null;
    }
    this.updateNoneTextChilds(oldElement, child as any);
    this.updateAttributes(oldElement, attributes);
    this.updateEventListeners(oldElement, eventListeners);
    if (typeof child === 'string') {
      if (child !== oldElement.node.textContent) {
        oldElement.innerText = child;
        oldElement.node.textContent = child;
      }
    }

    return oldElement;
  }

  private mountElement(
    key: any,
    tagName: string,
    child: string | Element | Array<Element>,
    attributes: ITagAttributes,
    eventListeners?: ITagListeners
  ) {
    const tagElement = this.opts.makeElement(tagName);
    this.mountNoneTextChilds(key, tagElement, child as any);
    if (typeof child === 'string') {
      tagElement.textContent = child;
    }
    this.elements[key] = {
      isRoot: false,
      tagName,
      attributes: {},
      innerText: typeof child === 'string' ? child : (null as any),
      eventListeners: {},
      node: tagElement,
      id: key,
      parentId: null,
    };

    this.updateAttributes(this.elements[key], attributes);
    this.updateEventListeners(this.elements[key] as Element, eventListeners);

    return this.elements[key];
  }

  private unmountElement(key: string) {
    if (this.elements[key].isRoot) {
      //@ts-ignore
      this.elements[key].clean();
    } else {
      this.elements[key].node.remove();
    }
    delete this.elements[key];
  }

  private updateAttributes = (
    element: Element,
    newAttributes: ITagAttributes = {}
  ) => {
    Object.keys(newAttributes).forEach((at) => {
      if (newAttributes[at] !== element.attributes[at]) {
        element.node.removeAttribute(at);
        element.node.setAttribute(at, newAttributes[at]);
      }
    });
    element.attributes = newAttributes;
  };

  private updateEventListeners = (
    element: Element,
    newEventListeners?: ITagListeners
  ) => {
    if (!newEventListeners) {
      return;
    }
    Object.keys(newEventListeners).forEach((at) => {
      if (element.eventListeners[at]) {
        element.node.removeEventListener(at, element.eventListeners[at]);
      }
      element.node.addEventListener(at, newEventListeners[at]);
    });
    element.eventListeners = newEventListeners;
  };

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
          this.touchedElements[ch.id] = true;
          this.elements[ch.id] = ch;
        }
        parentTag.appendChild(ch.node);
      });
    } else if (child.id) {
      if (child.isRoot) {
        this.touchedElements[child.id] = true;
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
        this.touchedElements[child.id] = true;
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
          this.touchedElements[ch.id] = true;
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
