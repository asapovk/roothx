import { Tags } from '../../../../../packages/core/lib/Tags';
import { TextInput } from '../../../../__shared/ui/Input';
import './styles.less';
import { dialogPortal } from '../../app/components/Dialog';

interface IMakeNewFolderForm {
  isShown: boolean;
  onSubmit: () => void;
  onChange: (val: string) => void;
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
                  onChange(e) {
                    opts.onChange(e.target.value);
                  },
                  size: 'l',
                  w: '340px',
                },
                `${key}_f_n_inp`
              ),
            }),
            tree.button({
              className: 'folder-button',
              child: 'submit',
              onClick: () => opts.onSubmit(),
            }),
          ],
        })
      : null
  );
