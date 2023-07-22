import { Tree } from '../../../../../packages/core/lib/NTree';
import { Tags } from '../../../../../packages/core/lib/Tags';

export const MainButton = (tags: Tags) =>
  tags.div({
    className: 'main-button-container',
    child: tags.div({
      className: 'main-button',
      child: 'MB',
    }),
  });
