import { Tags } from '../../../../../packages/core/lib/Tags';
import { Plus } from '../../../../__shared/ui/Svg/Plus';

export const MakeNewFolder = (tree: Tags, key: string) =>
  tree.div({
    className: 'make-new-folder',
    child: [
      Plus(tree, {}, `${key}_plus_icon`),
      tree.tag({
        tagName: 'span',
        child: 'add new folder',
        attributes: {},
      }),
    ],
  });
