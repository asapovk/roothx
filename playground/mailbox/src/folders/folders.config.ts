import {
  effectiveBite,
  effectiveInitialState,
} from '../../src/_redux/effectiveBite';
import { IState, ITriggers } from '../../src/_redux/types';
import { loadFolders } from '../_api/folders';
import { IFoldersState, IFoldersTriggers } from './interfaces/Folder.interface';
import { Bite, Slice } from '@reflexio/reflexio-on-redux';
import { FoldersScript } from './scripts/Folders.script';
import { DraggableFoldersScript } from './scripts/DraggableFolders.script';

export const foldersInitialState: IFoldersState = {
  foldersMap: {},
  loadFolders: effectiveInitialState(),
};

export const draggableFoldersBite = Bite<
  IFoldersTriggers,
  ITriggers,
  IFoldersState,
  IState,
  'draggableFolders'
>(
  {
    init: null,
    dragFolderDrop: null,
    dragFolderStart: null,
    dragFolderHover: null,
    setDropTargetFolder(state, payload) {
      state.dropTardetFolder = payload;
    },
    removeDropTargetFolder(state, payload) {
      state.dropTardetFolder = undefined;
    },
    hideDragStartFolder(state, payload) {
      state.dragStartFolder = payload;
    },
    revealDragStartFolder(state, payload) {
      state.dragStartFolder = undefined;
    },
    dragHoverLeave: null,
    cancelDragLeave: null,
  },
  {
    canTrigger: ['draggableFolders', 'folders'],
    script: DraggableFoldersScript,
    updateOn: ['draggableFolders'],
    instance: 'stable',
    triggerStatus: 'init',
  }
);

export const foldersBite = Bite<
  IFoldersTriggers,
  ITriggers,
  IFoldersState,
  IState,
  'folders'
>(
  {
    addNewFolder(state, payload) {
      state.foldersMap[payload.parentId].children.splice(
        0, //payload.index,
        0,
        payload.folder
      );
    },
    clickAddNew: null,
    clickFolder: null,
    deleteFolder(state, payload) {
      state.foldersMap[payload.parentId].children.splice(payload.index, 1);
    },
    init: null,
    moveFolder: null,
    setMap(state, payload) {
      state.foldersMap = payload;
    },
    highlightList: null,
    highlightRow: null,
    changeNode(state, payload) {
      state.foldersMap[payload.nodeId || 'root'] = {
        ...state.foldersMap[payload.nodeId || 'root'],
        ...payload.node,
      };
    },
    typing: null,
  },
  {
    canTrigger: ['folders', 'loadFolders', 'draggableFolders', 'appController'],
    instance: 'stable',
    updateOn: ['folders'],
    triggerStatus: 'init',
    script: FoldersScript,
  }
);

const loadFoldersBite = effectiveBite<
  IFoldersTriggers,
  ITriggers,
  IFoldersState,
  IState,
  'loadFolders'
>(loadFolders, 'loadFolders');

export const sidebarSlice = Slice<
  IFoldersTriggers,
  ITriggers,
  IFoldersState,
  IState
>(
  'folders',
  {
    folders: foldersBite,
    loadFolders: loadFoldersBite,
    draggableFolders: draggableFoldersBite,
  },
  foldersInitialState
);
