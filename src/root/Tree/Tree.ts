/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

interface Attributes {
  class?: string;
  style?: string;
  value?: string;
  innerText?: string;
  eventListener?: any;
}

export interface Element {
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
  protected cleanFactory: any = null;
  constructor(cleanFactory?: () => void) {
    if (cleanFactory) {
      this.cleanFactory = cleanFactory;
    }
  }

  protected rootElement?: Element;

  protected elements: { [key: string]: Element } = {};

  protected touchedElements: Array<any> = [];

  protected unmountElement(key: string) {
    //console.log(`Unmount ${key}`)
    if (this.elements[key].type === 'root') {
      //@ts-ignore
      this.elements[key].clean();
    } else {
      this.elements[key].node.remove();
    }
    delete this.elements[key];
  }

  protected calc() {
    for (const k in this.elements) {
      if (!this.touchedElements.includes(k)) {
        this.unmountElement(k);
      }
    }
    this.touchedElements = [];

    return this.rootElement;
  }
}
