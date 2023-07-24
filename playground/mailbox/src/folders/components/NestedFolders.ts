/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IState } from '../../_redux/types';
import './styles.less';
import { IFolder } from '../interfaces/Folder.interface';
import classNames from 'classnames';
import { Reflexio } from '../../root-redux/reflector';
import { Tree } from '../../../../../packages/core/lib/NTree';
import { Tags } from '../../../../../packages/core/lib/Tags';
import { Arrow } from '../../../../__shared/ui/Svg/Arrow';
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
    ['folders']
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
        eventListeners: {
          dragenter: () => {
            trigger('draggableFolders', 'dragFolderHover', {
              parentId: folder.parentId,
              targetIndex: index,
            });
          },
          dragover: (e) => {
            e.preventDefault();
            if (isDragHovered) {
              trigger('draggableFolders', 'cancelDragLeave', null);
            }
          },
          dragleave: (e) => {
            trigger('draggableFolders', 'dragHoverLeave', {
              parentId: folder.parentId,
              index: index,
            });
          },
          dragend: () => {
            //console.log('DDDD');
            trigger('draggableFolders', 'dragFolderDrop', {
              parentId: folder.parentId,
              targetIndex: index,
            });
          },
          dragstart: (e) => {
            // const ctx = document.createElement('div');
            // ctx.innerText = 'Переместить';
            // ctx.setAttribute('style', dataTransferStyle);
            // document.body.appendChild(ctx);
            // e.dataTransfer.setDragImage(ctx, 0, 0);
            trigger('draggableFolders', 'dragFolderStart', {
              index: index,
              parentId: folder.parentId,
            });
          },
        },
        attributes: {
          //@ts-ignore
          draggable: true,
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
              child: [
                list.length
                  ? Arrow(
                      tree,
                      {
                        size: 's',
                        style: {
                          marginRight: '5px',
                          transform: isOpened ? 'rotate(90deg)' : undefined,
                        },
                      },
                      `${folder.parentId || 'root'}_${folder.folderId}as`
                    )
                  : null,
                tree.tag(
                  {
                    attributes: {},
                    child: `${folder.name}`,
                    tagName: 'span',
                  },
                  `${folder.parentId || 'root'}_${folder.folderId}sp`
                ),
              ],
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
