/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Root } from '../../../packages/core/lib/NTree';
import { Application } from './App';
import './styles.less';

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
