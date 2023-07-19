import { IFolder } from '../folders/interfaces/Folder.interface';

export const loadFolders = async (): Promise<Array<IFolder>> => {
  const folders: Array<IFolder> = [
    {
      count: 0,
      folderId: '1',
      isOpened: true,
      name: 'Folder 1',
      parentId: null,
    },
    {
      count: 0,
      folderId: '2',
      isOpened: true,
      name: 'Folder 2',
      parentId: null,
    },
    {
      count: 0,
      folderId: '3',
      isOpened: true,
      name: 'Folder 3',
      parentId: null,
    },
    {
      count: 0,
      folderId: '4',
      isOpened: true,
      name: 'Folder 4',
      parentId: '5',
    },
    {
      count: 0,
      folderId: '5',
      isOpened: true,
      name: 'Folder 5',
      parentId: '9',
    },
    {
      count: 0,
      folderId: '6',
      isOpened: true,
      name: 'Folder 6',
      parentId: '9',
    },
    {
      count: 0,
      folderId: '7',
      isOpened: true,
      name: 'Folder 7',
      parentId: '1',
    },
    {
      count: 0,
      folderId: '8',
      isOpened: true,
      name: 'Folder 8',
      parentId: '1',
    },
    {
      count: 0,
      folderId: '9',
      isOpened: true,
      name: 'Folder 9',
      parentId: '1',
    },
    {
      count: 0,
      folderId: '10',
      isOpened: true,
      name: 'Folder 10',
      parentId: '1',
    },
  ];

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(folders);
    }, 1000);
  });
};
