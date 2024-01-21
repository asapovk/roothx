/* eslint-disable @typescript-eslint/no-empty-function */
import {
  ScriptUpdateArgsType,
  ScriptInitArgsType,
  ScriptOptsType,
} from '@reflexio/reflexio-on-redux/lib/types';
import { IState, ITriggers } from '../../_redux/types';
import { useSystem } from '@reflexio/reflexio-on-redux/lib';
import { IFolder, IFoldersTriggers } from '../interfaces/Folder.interface';

export class FoldersScript {
  //addNew => (id) => push into array[id]
  //changeParent => (id) => remove from array and push into another[id]
  //allOpenedFolders
  //onpeClose => {[parentfolderId]: [folders] }
  //onClose => delete prop from object
  // on Opend => find in global array and add prop to object
  //state[id] id = props.id

  constructor(
    private opts: ScriptOptsType<IFoldersTriggers, ITriggers, IState, 'folders'>
  ) {}

  public async init(
    args: ScriptInitArgsType<IFoldersTriggers, 'folders', 'init'>
  ) {
    console.log('FOLDERS INIT');
    // вызываем загрузку папок и ждем события done
    const result = await this.opts.hook('loadFolders', 'init', 'done', null);
    this.opts.trigger('draggableFolders', 'init', null);
    //this.opts.trigger('makeNewFolder', 'init', null);
    // потом записываем дерево в стейт
    this.opts.trigger('folders', 'setMap', this.makeMap(result));
  }

  // делаем из массива дерево чтобы удобнее было рендерить и обновлять
  private makeMap(args: Array<IFolder>): {
    [parentId: string]: { children: Array<IFolder>; isOpened: boolean };
  } {
    const map: {
      [parentId: string]: { children: Array<IFolder>; isOpened: boolean };
    } = {};

    args.forEach((f) => {
      if (!f.parentId) {
        if (!map['root']) {
          map['root'] = { children: [f], isOpened: true };
        } else {
          map['root'].children.push(f);
        }
      } else {
        if (!map[f.parentId]) {
          map[f.parentId] = { children: [f], isOpened: true };
        } else {
          map[f.parentId].children.push(f);
        }
      }
    });

    return map;
  }

  public async update(
    args: ScriptUpdateArgsType<IFoldersTriggers, 'folders', 'clickFolder'>
  ) {
    console.log(`${args.trigger}/${args.status}`);
    // console.log(args.payload);
    if (args.status === 'clickFolder') {
      const foldersState = this.opts.getCurrentState().folders;
      const map = foldersState.foldersMap;
      const payload = args.payload;
      const node = map[payload.folderId || 'root'];
      if (node) {
        this.opts.trigger('folders', 'changeNode', {
          node: {
            isOpened: !node.isOpened,
          },
          nodeId: payload.folderId,
        });
      }
    }
  }
}
