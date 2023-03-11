/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Style, StyleOpts } from './Style';

interface Attributes {
  class?: string;
  style?: string;
  value?: string;
  innerText?: string;
  eventListener?: any;
}

interface Element {
  id: string;
  parentId: string | null;
  node: HTMLElement;
  attributes: Attributes;
  type?: 'root';
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
      this.instances[key] = new Tree(() => {
        delete this.instances[key];
      });

      return this.instances[key];
    }
  }
}

export class Tree<T> {
  private cleanFactory: any = null;
  constructor(cleanFactory?: () => void) {
    if (cleanFactory) {
      this.cleanFactory = cleanFactory;
    }
  }

  private rootElement?: Element;

  private elements: { [key: string]: Element } = {};

  private touchedElements: Array<any> = [];

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

  public calc() {
    for (const k in this.elements) {
      if (!this.touchedElements.includes(k)) {
        this.unmountElement(k);
      }
    }
    this.touchedElements = [];

    return this.rootElement;
  }

  public input(opts: {
    key: keyof T;
    value?: string;
    style?: string;
    onChange?: (e: any) => void;
    getNode?: (el: HTMLElement) => void;
  }) {
    let elem: Element;
    if (!this.elements[opts.key as any]) {
      elem = this.mountInput(opts.key, opts.value, opts.style, opts.onChange);
      if (opts.getNode) {
        opts.getNode(elem.node);
      }
    } else {
      elem = this.updateInput(opts.key, opts.value, opts.style, opts.onChange);
    }
    this.touchedElements.push(opts.key);

    return elem;
  }

  public div(opts: {
    key: keyof T;
    child: string | Element | Array<Element> | null;
    style?: StyleOpts;
    if?: boolean;
    onClick?: () => void;
    getNode?: (el: HTMLElement) => void;
  }) {
    let elem: Element;
    let styleString: string = '';
    if (opts.style) {
      styleString = new Style().makeStyle(opts.style);
    }
    if (!this.elements[opts.key as any]) {
      if (opts.if !== undefined && !opts.if) {
        return null;
      }
      //@ts-ignore
      elem = this.mountElement(opts.key, opts.child, styleString, opts.onClick);
      if (opts.getNode) {
        opts.getNode(elem.node);
      }
    } else {
      if (opts.if !== undefined && !opts.if) {
        this.unmountElement(opts.key as any);

        return null;
      }
      //@ts-ignore
      elem = this.updateElement(
        opts.key,
        opts.child as any,
        styleString as any,
        opts.onClick
      );
    }
    this.touchedElements.push(opts.key);

    return elem;
  }

  // private findElement(parentId: string, id?: string): Element {
  //     const childs = Object.values(this.elements).filter(el => el.parentId === parentId)
  //     if(childs.length > 1) {
  //         if(id) {
  //             const element =  childs.find( ch => ch.id === id )
  //             if(element) return element
  //         }
  //         else {
  //             return childs[0]
  //         }
  //     } else {
  //         return childs[0]
  //     }
  // }

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

  private updateInput(
    key: any,
    value?: string,
    style?: string,
    onChange?: (e: Event) => void
  ) {
    const oldInput = this.elements[key];
    if (style) {
      oldInput.node.setAttribute('style', style);
    }
    if (value) {
      oldInput.node.setAttribute('value', value);
    }
    if (onChange) {
      oldInput.node.removeEventListener(
        'input',
        this.elements[key].attributes.eventListener
      );
      oldInput.node.addEventListener('input', onChange);
      this.elements[key].attributes.eventListener = onChange;
    }

    return oldInput;
  }

  private mountInput(
    key: any,
    value?: string,
    style?: string,
    onChange?: (e: Event) => void
  ) {
    const inputElement = document.createElement('input');
    if (style) {
      inputElement.setAttribute('style', style);
    }
    if (value) {
      inputElement.removeAttribute('value');
      inputElement.setAttribute('value', value);
    }
    if (onChange) {
      inputElement.addEventListener('input', onChange);
    }
    this.elements[key] = {
      attributes: {
        class: null as any,
        innerText: null as any,
        style: style,
        eventListener: onChange,
      },
      node: inputElement,
      id: key,
      parentId: null,
    };

    return this.elements[key];
  }

  private mountElement(
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

  private unmountElement(key: string) {
    //console.log(`Unmount ${key}`)
    if (this.elements[key].type === 'root') {
      //@ts-ignore
      this.elements[key].clean();
    } else {
      this.elements[key].node.remove();
    }
    delete this.elements[key];
  }
}
