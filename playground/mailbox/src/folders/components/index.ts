/* eslint-disable @typescript-eslint/ban-ts-comment */
// import { IState } from '../../../folders/src/_redux/types';
// import './styles.less';
// import React, { Fragment, memo, useEffect } from 'react';
// import { useReflector } from '@reflexio/redux-react';
// import { IFolder } from '../interfaces/Folder.interface';
// import { NestedFolders } from './NestedFolders';

import { Tree } from '../../../../../packages/core/lib/NTree';
import { Tags } from '../../../../../packages/core/lib/Tags';
import { IState } from '../../_redux/types';
import { Reflexio } from '../../root-redux/reflector';
import { NestedFolders } from './NestedFolders';

// import { useTrigger } from '../../../folders/src/_redux/useTrigger';
const reflexio = new Reflexio<IState['folders']>();

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

  const { state: sidebarState, trigger } = reflexio.useReflexio(
    (state: IState) => state.folders,
    Sidebar
  );

  const list = sidebarState.foldersMap['root']?.children || [];
  const isOpened = sidebarState.foldersMap['root']?.isOpened || false;

  return tags.root({
    onMount() {
      trigger('folders', 'init', null);
    },
    tagName: 'div',
    attributes: {
      class: 'sidebar-container',
    },
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
  });

  // return (
  //   <div className='sidebar-container'>
  //     {list.map((f, i) => (
  //       <NestedFolders key={f.folderId} index={i} folder={f} />
  //     ))}
  //   </div>
  // );
};
