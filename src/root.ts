/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Root } from './root/NTree';
import { Application } from './form';

(function main() {
  //@ts-ignore
  Root(Application().node);
})();
