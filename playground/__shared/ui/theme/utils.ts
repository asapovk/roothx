import { IMargin, IPadding, ISize } from './types';

export const pToStyle = (p: IPadding) =>
  Object.keys(p).reduce((st, key) => {
    if (key === 'pl') {
      st['paddingLeft'] = p[key];
    }
    if (key === 'pr') {
      st['paddingRight'] = p[key];
    }
    if (key === 'pt') {
      st['paddingTop'] = p[key];
    }
    if (key === 'pb') {
      st['paddingBottom'] = p[key];
    }
    if (key === 'p') {
      st['padding'] = p[key];
    }

    return st;
  }, {});

export const sizeToButtonClass = (size: ISize) => `oj-ui-btn_${size}`;
export const sizeToHeaderClass = (size: ISize) => `oj-ui-h_${size}`;

export const mToStyle = (p: IPadding) =>
  Object.keys(p).reduce((st, key) => {
    if (key === 'ml') {
      st['marginLeft'] = p[key];
    }
    if (key === 'mr') {
      st['marginRight'] = p[key];
    }
    if (key === 'mt') {
      st['marginTop'] = p[key];
    }
    if (key === 'mb') {
      st['marginBottom'] = p[key];
    }
    if (key === 'm') {
      st['margin'] = p[key];
    }

    return st;
  }, {});
