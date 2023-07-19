import { IState } from '../../_redux/types';
import './styles.less';
import { IFolder } from '../interfaces/Folder.interface';
import classNames from 'classnames';
import { Reflexio } from '../../root-redux/reflector';
import { Tree } from '../../../../../packages/core/lib/NTree';
import { Tags } from '../../../../../packages/core/lib/Tags';
//import { Arrow } from '../../_ui/Svg/Arrow';

//это если надо сдалать кастомный ghost
const dataTransferStyle =
  'display: absolute; top: -150px; height: 40px; width: 160px;';

const reflexio = new Reflexio<IState['folders']>();

export const NestedFolders = (
  tree: Tags,
  {
    folder,
    index,
    key,
    nestingLevel = 0, // уровень вложенности который мы прокидываем внутрь с +1 чтобы знать какой делать отступ слева
  }: {
    folder: IFolder;
    index: number;
    key: string;
    nestingLevel?: number;
  }
) => {
  const { state: sidebarState, trigger } = reflexio.useReflexio(
    (state: IState) => state.folders,
    () => {
      console.log('i do nothing');
    }
  );

  const list = sidebarState.foldersMap[folder.folderId]?.children || [];
  // Флаг - открыт ли список дочерних папок
  const isOpened = sidebarState.foldersMap[folder.folderId]?.isOpened || false;

  /* Флаг - находится ли перемещаемая папка над данной */
  const isDragHovered =
    sidebarState?.dropTardetFolder?.parentId === folder.parentId &&
    sidebarState?.dropTardetFolder?.index === index;

  /* Флаг - является ли данная папка перемещаемой в текущий момент*/
  const isDragged =
    sidebarState?.dragStartFolder?.parentId === folder.parentId &&
    sidebarState?.dragStartFolder?.index === index;

  return [
    tree.tag(
      {
        tagName: 'li',
        attributes: {
          class: classNames('folder-item', {
            hovered: isDragHovered,
            dragging: isDragged,
          }),
        },
        child: [
          ...Array.from(Array(nestingLevel).keys()).map((a, i) =>
            tree.div(
              { className: 'liner', child: ' ' },
              `${folder.folderId}_${i}ll`
            )
          ),
          tree.div(
            {
              onClick: () =>
                trigger('folders', 'clickFolder', {
                  parentId: folder.parentId,
                  folderId: folder.folderId,
                }),
              className: 'name',
              child: `${folder.name}`,
            },
            `${folder.parentId || 'root'}_${folder.folderId}name`
          ),
        ],
      },
      `f_li${folder.folderId}`
    ),

    ...(isOpened
      ? list.reduce(
          (v, f, i) => [
            ...v,
            ...NestedFolders(tree, {
              folder: f,
              index: i,
              nestingLevel: nestingLevel + 1,
              key: `${f.parentId || 'root'}_${f.folderId}`,
            }),
          ],
          []
        )
      : []),
  ];
};
