/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Root } from './root/Tree';
import { Component } from './app/Componet';

(function main() {
  //@ts-ignore
  Root(Component().node);
})();
