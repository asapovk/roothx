import { Tags } from '../../../../../packages/core/lib/Tags';
import { TextInput } from '../../../../__shared/ui/Input';
import './styles.less';
import { dialogPortal } from '../../app/components/Dialog';

interface IMakeNewFolderForm {
  isShown: boolean;
}

export const MakeNewFolderForm = (
  tree: Tags,
  opts: IMakeNewFolderForm,
  key: string
) =>
  dialogPortal.toPortal(
    opts.isShown
      ? tree.div({
          className: 'sidebar-make-new-folder-form',
          child: [
            tree.div({
              className: 'folder-name',
              child: TextInput(
                tree,
                {
                  size: 'l',
                  w: '300px',
                },
                `${key}_f_n_inp`
              ),
            }),
          ],
        })
      : null
  );
