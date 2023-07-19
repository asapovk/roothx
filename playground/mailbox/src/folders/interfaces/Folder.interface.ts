import { Bite, Slice } from '@reflexio/reflexio-on-redux';
import { TriggerPhaseWrapper } from '@reflexio/reflexio-on-redux/lib/types';
import { EffectiveState, EffectiveTrigger } from '../../_redux/effectiveBite';

export interface ILoadFoldersArgs {
  dummyArg: string;
}

export interface IFolder {
  folderId: string; //id  папки
  parentId: string | null; //id родительской папки
  isOpened: boolean;
  name: string;
  count: number | null;
}
export interface IFoldersState {
  //данные и статусы загрузки
  loadFolders: EffectiveState<ILoadFoldersArgs, Array<IFolder>, Error>;
  //пока не используется
  highlightedList?: string;
  //отмечена папка над которой движемая папка
  dropTardetFolder?: {
    parentId?: string;
    index: number;
  };
  //отмечена папка которая движется
  dragStartFolder?: {
    parentId?: string;
    index: number;
  };
  //дерево папок которое отображаем
  foldersMap: {
    [parentId: string]: { children: Array<IFolder>; isOpened: boolean };
  };
}

export interface IFoldersTriggers {
  // тут init done error отвечающие начальное загрузке списка папок с бека
  loadFolders: EffectiveTrigger<ILoadFoldersArgs, Array<IFolder>, Error>;
  // тут эвенты отвечающие за drag-n-drop
  draggableFolders: TriggerPhaseWrapper<{
    init: null;
    //начато движение папки
    dragFolderStart: { parentId?: string; index: number };
    //закончено движение папки
    dragFolderDrop: { parentId?: string; targetIndex: number };
    //папка  hovered
    dragFolderHover: { parentId?: string; targetIndex: number };
    //эвент что надо как-то подсветить место куда мы можем бросить двигаемую папку
    setDropTargetFolder: {
      parentId?: string;
      index: number;
    };
    //эвент что надо как-то подсветить папку которую начали двигать
    hideDragStartFolder: {
      parentId?: string;
      index: number;
    };
    //эвент что надо снять подсветку папки которую начали двигать
    revealDragStartFolder: {
      parentId?: string;
      index: number;
    };
    // эвент удаление подсветки hovered папки
    dragHoverLeave: {
      parentId?: string;
      index: number;
    };
    //эвент отмена удаления подсветки hovered папки
    cancelDragLeave: null;
    removeDropTargetFolder: {
      parentId?: string;
      index: number;
    };
  }>;
  //тут евенты отвечающие изменению вида дерева папок
  folders: TriggerPhaseWrapper<{
    init: null;
    //не используется сейчас
    clickAddNew: null;
    //открыть закрыть
    clickFolder: { parentId?: string; folderId: string };
    //не используется сейчас
    highlightList: { parentId?: string };
    //не используется сейчас
    highlightRow: { parentId?: string; index: number };
    //добавить папку в дерево
    addNewFolder: { parentId?: string; index: number; folder: IFolder };
    //удалить папку из дерева
    deleteFolder: { parentId?: string; index: number };
    //набор текста (может имени папки) не используется
    typing: string;
    //не используется
    moveFolder: { parentId?: string; folderId: string; newParentId?: string };
    //положить дерево в стейт (при старте)
    setMap: Partial<IFoldersState['foldersMap']>;
    //изменить узел дерева в стейт
    changeNode: {
      nodeId?: string; //это id папки
      node: Partial<{ isOpened: boolean; children: Array<IFolder> }>;
    };
  }>;
}
