# @roothx/core

A simple, lightweight UI render engine — a React-like engine without JSX or a virtual DOM diffing algorithm. Elements are identified by explicit keys and reconciled directly against the real DOM.

## Installation

```bash
npm install @roothx/core
# or
yarn add @roothx/core
```

## Core concepts

Rendering is done by calling tag functions on every update cycle. Each element is given a stable **key** string. On re-render the engine compares the existing keyed element to the new call: if the key is seen again the element is updated in-place, if a key disappears the element is unmounted. No virtual DOM, no diffing — just a keyed registry.

```
Tree  ─── tracks elements by key, mounts/updates/unmounts DOM nodes
Tags  ─── convenience wrappers: div(), button(), text(), textInput(), …
State ─── per-instance useState(), triggers a re-render on setState
Keep  ─── persists a controller instance across re-renders (like useRef)
Style ─── converts a style-options object to a CSS inline-style string
```

## Quick start

```ts
import { Tree, Tags, Root } from '@roothx/core';

// 1. Create a tree bound to native DOM creation
const tree = new Tree({ makeElement: (tag) => document.createElement(tag) });
const t = new Tags(tree);

// 2. A render function — called on mount and on every state change
function render() {
  Root(
    t.root(
      {
        tagName: 'div',
        child: t.div(
          {
            child: t.text({ text: 'Hello world' }, 'greeting'),
            className: 'container',
          },
          'root-div'
        ),
      },
      'app-root'
    ).node
  );
}

render();
```

## API

### `Tree`

```ts
new Tree({ makeElement: (tagName: string) => HTMLElement }, cleanFactory?: () => void)
```

The core reconciler. You provide a factory for creating raw DOM elements (usually `document.createElement`).

| Method | Description |
|---|---|
| `root(opts, key?)` | Mount or update the root element of this tree. Returns the root `Element`. |
| `tag(opts, key?)` | Mount or update a child element tracked by `key`. Returns the `Element`. |
| `unmountRoot()` | Remove the root node from the DOM, call the `onUnmount` callback, and clean up all child elements. |

**`root` / `tag` opts**

```ts
{
  tagName: string;          // e.g. 'div', 'button', 'svg'
  child: Element | Element[] | string | null;
  attributes?: {
    class?: string; style?: string; id?: string;
    value?: string; width?: string; height?: string;
    viewBox?: string; d?: string;
  };
  eventListeners?: { [eventName: string]: (e: any) => void };
  withNode?: (el: HTMLElement, isMounting: boolean) => void;
  onMount?: () => void;     // root only — fires after first mount
  onUpdate?: () => void;    // root only — fires after each update
  onUnmount?: () => void;   // root only — fires on unmountRoot()
  isMute?: boolean;         // root only — hide without unmounting
}
```

### `TreeFactory`

```ts
new TreeFactory({ makeElement: (tagName: string) => HTMLElement })
```

Manages a pool of named `Tree` instances. Useful when you mount many independent component trees.

```ts
const factory = new TreeFactory({ makeElement: (t) => document.createElement(t) });
const tags = factory.getInstance('my-component'); // creates or reuses a Tags instance
```

### `Tags`

High-level element helpers built on `Tree`. Every method accepts an optional `key` argument.

| Method | Description |
|---|---|
| `div(opts, key?)` | Renders a `<div>` |
| `button(opts, key?)` | Renders a `<button>` |
| `text(opts, key?)` | Renders a `<p>` with text content |
| `headerText(opts, key?)` | Renders `<h1>`–`<h6>` (pass `size` 1–6) |
| `textInput(opts, key?)` | Renders an `<input>` |
| `textArea(opts, key?)` | Renders a `<textarea>` |
| `tag(opts, key?)` | Escape hatch — raw `Tree.tag()` |
| `root(opts, key?)` | Escape hatch — raw `Tree.root()` |

### `State<T>`

Per-instance state container. Mirrors the React `useState` pattern.

```ts
import { State } from '@roothx/core';

const counter = new State<number>();

function render() {
  const { state, setState } = counter.useState(0, render);
  // state === current value; setState(n) updates and re-calls render
}
```

`useState(initialState, context)` only sets the initial value on the **first** call. On subsequent calls it returns the current state. `context` is the function to call on `setState`.

### `Keep<T>`

Persists a controller instance across re-renders (like a class component or `useRef`).

```ts
import { Keep } from '@roothx/core';

class MyController { /* ... */ }
const keeper = new Keep<MyController>();

function render() {
  keeper.useController(
    () => new MyController(),   // factory — called once on mount
    (ctrl) => {                 // receives the persistent instance every render
      // use ctrl here
    }
  );
}
```

### `Style`

Converts a typed options object to a CSS inline-style string.

```ts
import { Style } from '@roothx/core';

const style = new Style();
const css = style.makeStyle({ backgroundColor: '#fff', fontSize: '14px', padding: '8px' });
// → "background-color: #fff;\nfont-size: 14px;\npadding: 8px;\n"
```

### `createPortal`

Creates a portal pair — useful for rendering children in a detached location (e.g. modals).

```ts
import { createPortal } from '@roothx/core';

const portal = createPortal();

// In parent tree: consume the portal output
const child = portal.fromPortal(); // returns whatever was passed to toPortal

// In child tree: send an element through the portal
portal.toPortal(myElement); // returns null (removes from original position)
```

## Changelog

### 0.4.0
- **Fix:** `unmountRoot` now properly walks and unmounts all tracked child elements before clearing the registry. Previously, only the root node was removed from the DOM while child nodes and nested `Root` children were silently leaked.

### 0.3.9
- Internal improvements and stability fixes.

## License

MIT — Konstantin Astapov
