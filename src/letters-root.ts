/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Root } from './root/NTree';
import { LettersList } from './letters/components/LettersList';

(function main() {
  //@ts-ignore
  Root(LettersList().node);
})();
