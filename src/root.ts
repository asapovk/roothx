/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Root } from './root/NTree';
import { Application } from './App';
import { AuthForm } from '../packages/auth-page/src/auth/components/form/index';

(function main() {
  //@ts-ignore
  Root(Application().node);
})();

/** *
 * TO DO:
 * if child returns null  and then updates returning not null
 * without parent render => it will not be mouned still
 *
 *
 *
 */
