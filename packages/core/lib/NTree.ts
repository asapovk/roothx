/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Tags } from "./Tags";

export interface ITagAttributes {
  class?: string;
  style?: string;
  value?: string;
  width?: string;
  height?: string;
  viewBox?: string;
  d?: string;
  id?: string;
}

export interface ITagListeners {
  [eventName: string]: (e: any) => void;
}

export interface Element {
  id: string;
  isMute: boolean;
  parentId: string | null;
  node: HTMLElement;
  innerText?: string;
  attributes: ITagAttributes;
  eventListeners: ITagListeners;
  isRoot: boolean;
  tagName: string;
  clean?: () => void;
  mute?: (id: string) => void;
  unMute?: (element: Element) => void;
}

export function createPortal() {
  let teleportingChild:
    | Element
    | string
    | null
    | Array<Element | string | null>;
  const portal = {
    fromPortal: () => teleportingChild,
    toPortal: (
      child: Element | string | null | Array<Element | string | null>
    ) => {
      teleportingChild = child;

      return null;
    },
  };

  return portal;
}

export function Root(element: HTMLElement): void {
  const rootElement = document.getElementById('app');
  if (rootElement) {
    rootElement.appendChild(element);
  }
}

export class TreeFactory {
  constructor(private opts: {makeElement: (tagName: string)=> HTMLElement}) {

  }
  private instances: { [key: string]:  Tags } = {};

  public getInstance(key: string): Tags {
    if (this.instances[key]) {
      return this.instances[key];
    } else {
      const tree = new Tree(
        { makeElement: this.opts.makeElement, keyPrefix: key},
        () => {
          delete this.instances[key];
        }
      );
      this.instances[key] = new Tags(tree);

      return this.instances[key];
    }
  }
}

//interface HTMLElement

interface ITreeOpts {
  makeElement: (tagName: string) => HTMLElement;
  keyPrefix?: string; 
}

export class Tree {
  private cleanFactory: any = null;
  constructor(private opts: ITreeOpts, cleanFactory?: () => void) {
    if (cleanFactory) {
      this.cleanFactory = cleanFactory;
    }
    this.keyPrefix = opts.keyPrefix;
  }

  private keyPrefix: string; 

  private rootElement?: Element;

  private elements: { [key: string]: Element } = {};

  private touchedElements: { [key: string]: boolean } = {};

  private onUnmountRoot: () => void;

  public root(
    opts: {
      tagName: string;
      withNode?: (el: HTMLElement, isMounting: boolean) => void;
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
      isMute?: boolean;
    },
    key?: string
  ) {
    const keyWithPrefix = this.keyPrefix && key ? this.keyPrefix + key: key;
  
    let isMounting = false;
    if (!this.rootElement) {
      this.mountRoot(
        keyWithPrefix,
        opts.child as Element,
        opts.attributes,
        opts.eventListeners,
        opts.tagName,
        opts.isMute,
      );
      isMounting = true;
      // if (opts.onMount) {
      //   setTimeout(opts.onMount);
      // }
      if (opts.onUnmount) {
        this.onUnmountRoot = opts.onUnmount;
      }
    } else {
      //@ts-ignore
      this.rootElement.id = keyWithPrefix;
      this.updateRoot(
        opts.child as Element,
        opts.attributes,
        opts.eventListeners
      );
      if (opts.onUpdate) {
        setTimeout(opts.onUpdate);
      }
    }

    const resp = this.calc();

    if (Boolean(opts.isMute) !== this.rootElement.isMute) {
      if (opts.isMute) {
        this.rootElement.mute(resp.id);
      } else {
        this.rootElement.unMute(resp);
      }
    }
    if(opts.withNode) {
      opts.withNode(this.rootElement.node, isMounting)
    }
    if (isMounting && resp && opts.onMount) {
      setTimeout(opts.onMount);
    }

    return resp;
  }

  public unmountRoot = () => {
    if (this.cleanFactory) {
      this.cleanFactory();
    }
    //@ts-ignore
    if (this.onUnmountRoot) {
      this.onUnmountRoot();
    }

    this.rootElement && this.rootElement.node.remove(); //async
    this.rootElement = undefined;
    this.elements = {};
  };

  private calc() {
    Object.keys(this.elements).forEach((k) => {
      if (!this.touchedElements[k]) {
        this.unmountElement(k);
      }
    });

    //@ts-ignore
    this.touchedElements = {};

    return this.rootElement;
  }

  public tag(
    opts: {
      tagName: string;
      child:
        | Array<Element | null | string | undefined>
        | Element
        | string
        | null
        | undefined;
      attributes: {
        width?: string;
        height?: string;
        viewBox?: string;
        value?: string;
        style?: string;
        id?: string;
        d?: string;
        class?: string;
      };
      eventListeners?: ITagListeners;
      withNode?: (el: HTMLElement, isMounting: boolean) => void;
    },
    key?: string
  ) {
    let keyWithPrefix = key && this.keyPrefix ? this.keyPrefix + key : key;
    let elem: Element;
    let isMounting: boolean = true;
    if (!this.elements[keyWithPrefix as any]) {
      elem = this.mountElement(
        keyWithPrefix,
        opts.tagName,
        opts.child as Element,
        opts.attributes,
        opts.eventListeners
      );
    } else {
      isMounting = false;
      elem = this.updateElement(
        keyWithPrefix,
        opts.child as Element,
        opts.attributes,
        opts.eventListeners
      );
    }

      if (opts.withNode) {
        opts.withNode(elem.node, isMounting);
      }

    this.touchedElements[keyWithPrefix as string] = true;

    return elem;
  }

  private mountRoot(
    key: string,
    child: string | Element | Array<Element> | null,
    attributes: ITagAttributes = {},
    eventListeners: ITagListeners,
    tagName: string,
    isMute?: boolean
  ) {
    const divElement = this.opts.makeElement(tagName);
    this.mountNoneTextChilds(key, divElement, child as any);
    if (typeof child === 'string') {
      divElement.textContent = child;
    }
    this.rootElement = {
      isRoot: true,
      isMute: isMute || false,
      tagName: tagName,
      innerText: typeof child === 'string' ? child : (null as any),
      clean: this.unmountRoot, //to remove root inside childred Root from parent
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
      oldElement.innerText = null;
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
      oldElement.node.textContent = null;
      oldElement.innerText = null;
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
      isMute: false,
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

  private unmuteChildRoot = (child: Element) => {
    const elementObject = this.elements[child.id];
    elementObject.node = child.node;
    if(child.parentId) {
      const parentElement = this.elements[child.parentId] || this.rootElement;
      elementObject.isMute = false;
      if (parentElement && parentElement.node) {
        parentElement.node.appendChild(child.node);
    }
    }
  };

  private muteChildRoot = (id: string) => {
    const element = this.elements[id];
    if (element) {
      element.isMute = true;
      element.node.remove(); // removed from DOM but still in elements object;
    }
  };

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
    if (!child) {
      return;
    }
    if (Array.isArray(child)) {
      child.forEach((ch) => {
        if (!ch) {
          return;
        }
        ch.parentId = parentKey;
        if (ch.isRoot) {
          this.touchedElements[ch.id] = true;
          this.elements[ch.id] = ch;
          ch.mute = this.muteChildRoot;
          ch.unMute = this.unmuteChildRoot;
        }
        if (!ch.isMute) {
          parentTag.appendChild(ch.node);
        }
      });
    } else if (child.id) {
      if (child.isRoot) {
        this.touchedElements[child.id] = true;
        this.elements[child.id] = child;
        child.mute = this.muteChildRoot;
        child.unMute = this.unmuteChildRoot;
      }
      child.parentId = parentKey;
      if (!child.isMute) {
        parentTag.appendChild(child.node);
      }
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
        child.mute = this.muteChildRoot;
        child.unMute = this.unmuteChildRoot;
        if (!child.isMute) {
          oldElement.node.appendChild(child.node);
        }
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
          ch.mute = this.muteChildRoot;
          ch.unMute = this.unmuteChildRoot;
          if (!index) {
            if (!child.isMute) {
              oldElement.node.prepend(ch.node);
            }
          } else {
            const prevNode = child[lastNonNullIndex - 1].node;
            if (!child.isMute) {
              prevNode.after(ch.node);
            }
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
