/* eslint-disable @typescript-eslint/ban-ts-comment */
// import { IState } from '../../../folders/src/_redux/types';
// import './styles.less';
// import React, { Fragment, memo, useEffect } from 'react';
// import { useReflector } from '@reflexio/redux-react';
// import { IFolder } from '../interfaces/Folder.interface';
// import { NestedFolders } from './NestedFolders';

import { Tree } from '../../../../../packages/core/lib/NTree';
import { Tags } from '../../../../../packages/core/lib/Tags';
import { IState, ITriggers } from '../../_redux/types';
import { Reflexio } from '../../../../../packages/on-reflexio/lib/reflector';
import { MakeNewFolder } from './MakeNewFolder';
import { MakeNewFolderForm } from './MakeNewFolderForm';
import { NestedFolders } from './NestedFolders';
import {store,system} from '../../_redux/index';

// import { useTrigger } from '../../../folders/src/_redux/useTrigger';
const reflexio = new Reflexio<ITriggers, IState>(store, system);

const tree = new Tree({
  //@ts-ignore
  makeElement: (tag) => {
    if (tag === 'svg' || tag === 'path') {
      return document.createElementNS('http://www.w3.org/2000/svg', tag);
    } else {
      return document.createElement(tag);
    }
  },
});
//@ds-replace
const tags = new Tags(tree);
export const Sidebar = () => {
  // useEffect(() => {
  //   trigger('folders', 'init', null); //заводим главный скрипт отвечающий за логику папок
  // }, []);

  const { state, trigger } = reflexio.useReflexio(
    (state: IState) => ({ folders: state.folders, app: state.app }),
    ['folders', 'draggableFolders', 'makeNewFolder', 'dialog'],
    Sidebar
  );

  const list = state.folders?.foldersMap['root']?.children || [];
  const isOpened = state.folders?.foldersMap['root']?.isOpened || false;

  return tags.root({
    // onMount() {
    //   trigger('folders', 'init', null);
    // },
    tagName: 'div',
    attributes: {
      class: 'sidebar-container',
    },
    isMute: state.app.sizeMode !== '3col' ,
    child: [
      tags.tag({
        child: 'New Letter',
        tagName: 'button',
        attributes: {
          class: 'lettersListButton',
        },
        eventListeners: {
          click: () => trigger('setContent', 'openWindow', { id: '-1' }),
        },
      }),
      MakeNewFolder(
        tags,
        {
          clickNew: () => {
            trigger('dialog', 'init', () =>
              trigger('dialog', 'closeDialog', null)
            );
            trigger('makeNewFolder', 'init', null);
            trigger('dialog', 'openDialog', null);
          },
        },
        'make_new_f_btn'
      ),
      MakeNewFolderForm(
        tags,
        {
          isShown: Boolean(state.app.dialog?.isOpen),
          onSubmit: () => trigger('makeNewFolder', 'submitForm', null),
          onChange: (val) =>
            trigger('makeNewFolder', 'typeValue', { value: val }),
        },
        'make_new_form'
      ),
      tags.div({
        className: 'folders-list',
        child: list.reduce(
          (v, f, i) => [
            ...v,
            ...NestedFolders(tags, {
              folder: f,
              index: i,
              nestingLevel: 0,
              key: `${f.parentId || 'root'}_${f.folderId}`,
            }),
          ],
          []
        ),
      }),
    ],
  });

  // return (
  //   <div className='sidebar-container'>
  //     {list.map((f, i) => (
  //       <NestedFolders key={f.folderId} index={i} folder={f} />
  //     ))}
  //   </div>
  // );
};
