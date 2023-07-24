/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-empty-function */
import {
  ScriptUpdateArgsType,
  ScriptInitArgsType,
  ScriptOptsType,
} from '@reflexio/reflexio-on-redux/lib/types';
import { IState, ITriggers } from '../../_redux/types';
import { useSystem } from '@reflexio/reflexio-on-redux/lib';
import { IFolder, IFoldersTriggers } from '../interfaces/Folder.interface';

export class DraggableFoldersScript {
  constructor(
    private opts: ScriptOptsType<
      IFoldersTriggers,
      ITriggers,
      IState,
      'draggableFolders'
    >
  ) {}

  private dragHoverTimeout = null;

  public async init(
    args: ScriptInitArgsType<IFoldersTriggers, 'draggableFolders', 'init'>
  ) {}

  private handleDrop() {
    const state = this.opts.getCurrentState().folders;
    if (state.dropTardetFolder) {
      const targetIndex = state.dropTardetFolder?.index;
      const targetParentId = state.dropTardetFolder.parentId || 'root';
      this.opts.trigger('draggableFolders', 'removeDropTargetFolder', {
        index: targetIndex,
        parentId: targetParentId,
      });
      const dragStartFolder = state.dragStartFolder;
      if (dragStartFolder) {
        const startIndex = state.dragStartFolder?.index;
        const startParentId = state.dragStartFolder.parentId || 'root';
        const movingFolder = {
          ...state.foldersMap[dragStartFolder.parentId || 'root'].children[
            dragStartFolder.index
          ],
        };

        this.opts.trigger('draggableFolders', 'revealDragStartFolder', {
          index: startIndex,
          parentId: startParentId,
        });
        this.opts.trigger('folders', 'deleteFolder', {
          index: startIndex, //state.dragStartFolder?.index,
          parentId: startParentId, //state.dragStartFolder.parentId || 'root',
        });

        if (movingFolder) {
          this.opts.trigger('folders', 'addNewFolder', {
            index: state.dropTardetFolder?.index,
            parentId: state.dropTardetFolder.parentId || 'root',
            folder: {
              ...movingFolder,
              parentId: state.dropTardetFolder.parentId,
            },
          });
        }
      }
    }
  }

  public async update(
    args: ScriptUpdateArgsType<
      IFoldersTriggers,
      'draggableFolders',
      | 'dragFolderHover'
      | 'dragFolderStart'
      | 'dragFolderDrop'
      | 'dragHoverLeave'
      | 'cancelDragLeave'
    >
  ) {
    console.log(`${args.trigger}/${args.status}`);
    // console.log(args.payload);
    if (args.status === 'dragFolderStart') {
      //тут таймаут нужен если мы хотим скрыть двигаемый объект.
      setTimeout(() =>
        this.opts.trigger('draggableFolders', 'hideDragStartFolder', {
          parentId: args.payload.parentId,
          //@ts-ignore
          index: args.payload.index,
        })
      );
    }
    // когда мы отпустили элемент
    if (args.status === 'dragFolderDrop') {
      this.handleDrop();
    }
    if (args.status === 'cancelDragLeave') {
      // тригерится вский раз когд мы находимся над элеметами чтобы ресетнуть dragHoverLeave
      // и подсветка target элемента не снималать
      if (this.dragHoverTimeout) {
        clearTimeout(this.dragHoverTimeout);
      }
    }
    if (args.status === 'dragHoverLeave') {
      //подсветка target снимается не сразу, поскольку эвент leave файрится постоянно даже когда
      // по факту мы все еще над элементом
      this.dragHoverTimeout = setTimeout(() => {
        const state = this.opts.getCurrentState().folders;
        if (state.dropTardetFolder) {
          this.opts.trigger('draggableFolders', 'removeDropTargetFolder', {
            index: state.dropTardetFolder?.index,
            parentId: state.dropTardetFolder.parentId,
          });
        }
        // if (state.dragStartFolder) {
        //   this.opts.trigger('draggableFolders', 'revealDragStartFolder', {
        //     index: state.dragStartFolder?.index,
        //     parentId: state.dragStartFolder.parentId,
        //   });
        // } else {
        //   console.log('no dragStartFolder ');
        // }
      }, 1000);
    }
    if (args.status === 'dragFolderHover') {
      //очишаем таймаут для удаления старого ховера;
      clearTimeout(this.dragHoverTimeout);
      const state = this.opts.getCurrentState().folders;
      if (state.dropTardetFolder) {
        //и ручками сами удаляем страый ховер
        this.opts.trigger('draggableFolders', 'removeDropTargetFolder', {
          index: state.dropTardetFolder?.index,
          parentId: state.dropTardetFolder.parentId,
        });
      }
      const payload = args.payload as unknown as {
        parentId?: string;
        targetIndex: number;
      };
      //ставим новый ховер
      this.opts.trigger('draggableFolders', 'setDropTargetFolder', {
        parentId: payload.parentId,
        index: payload.targetIndex,
      });
    }
  }
}
