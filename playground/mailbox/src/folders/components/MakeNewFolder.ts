import { Tags } from '../../../../../packages/core/lib/Tags';
import { Plus } from '../../../../__shared/ui/Svg/Plus';

interface IMakeNewFolder {
  clickNew: () => void;
}

export const MakeNewFolder = (tree: Tags, opts: IMakeNewFolder, key: string) =>
  tree.div({
    className: 'make-new-folder',
    onClick: () => opts.clickNew(),
    child: [
      Plus(tree, {}, `${key}_plus_icon`),
      tree.tag({
        tagName: 'span',
        child: 'add new folder',
        attributes: {},
      }),
    ],
  });
