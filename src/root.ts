/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Root } from './root/Tree';
import { Application } from './form';
import { Component } from './app/Componet';

(function main() {
  //@ts-ignore
  Root(Application().node);
})();
